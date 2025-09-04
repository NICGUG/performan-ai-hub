import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Database {
  public: {
    Tables: {
      documentos_puesto: {
        Row: {
          id: string;
          nombre_archivo: string;
          ruta_archivo: string;
          puesto_id: string;
        };
      };
      valoraciones_documentos: {
        Insert: {
          documento_id: string;
          puesto_id: string;
          criterio: string;
          puntuacion: number;
          texto_original?: string;
          metodo_extraccion?: string;
        };
      };
    };
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { documentoId, procesarTodos } = await req.json();
    
    let documentos = [];
    
    if (procesarTodos) {
      // Obtener todos los documentos
      const { data, error } = await supabaseClient
        .from('documentos_puesto')
        .select('id, nombre_archivo, ruta_archivo, puesto_id');
      
      if (error) throw error;
      documentos = data || [];
    } else if (documentoId) {
      // Obtener documento específico
      const { data, error } = await supabaseClient
        .from('documentos_puesto')
        .select('id, nombre_archivo, ruta_archivo, puesto_id')
        .eq('id', documentoId)
        .single();
      
      if (error) throw error;
      documentos = [data];
    }

    const resultados = [];

    for (const documento of documentos) {
      try {
        console.log(`Procesando documento: ${documento.nombre_archivo}`);
        
        // Descargar archivo desde Supabase Storage
        const { data: fileData, error: downloadError } = await supabaseClient
          .storage
          .from('documentos')
          .download(documento.ruta_archivo);

        if (downloadError) {
          console.error(`Error descargando ${documento.nombre_archivo}:`, downloadError);
          continue;
        }

        // Convertir a ArrayBuffer
        const arrayBuffer = await fileData.arrayBuffer();
        
        // Extraer texto del documento Word usando mammoth
        const mammoth = await import('https://esm.sh/mammoth@1.6.0');
        const result = await mammoth.extractRawText({ arrayBuffer });
        const texto = result.value;

        console.log(`Texto extraído de ${documento.nombre_archivo} (${texto.length} caracteres)`);

        // Extraer valoraciones del final del documento
        const valoraciones = extraerValoraciones(texto);
        
        if (valoraciones.length > 0) {
          // Eliminar valoraciones existentes para este documento
          await supabaseClient
            .from('valoraciones_documentos')
            .delete()
            .eq('documento_id', documento.id);

          // Insertar nuevas valoraciones
          const valoracionesData = valoraciones.map(v => ({
            documento_id: documento.id,
            puesto_id: documento.puesto_id,
            criterio: v.criterio,
            puntuacion: v.puntuacion,
            texto_original: v.textoOriginal,
            metodo_extraccion: 'automatico'
          }));

          const { error: insertError } = await supabaseClient
            .from('valoraciones_documentos')
            .insert(valoracionesData);

          if (insertError) {
            console.error(`Error insertando valoraciones para ${documento.nombre_archivo}:`, insertError);
          } else {
            console.log(`Insertadas ${valoraciones.length} valoraciones para ${documento.nombre_archivo}`);
          }
        }

        resultados.push({
          documento_id: documento.id,
          nombre_archivo: documento.nombre_archivo,
          valoraciones_encontradas: valoraciones.length,
          valoraciones: valoraciones,
          exito: true
        });

      } catch (error) {
        console.error(`Error procesando ${documento.nombre_archivo}:`, error);
        resultados.push({
          documento_id: documento.id,
          nombre_archivo: documento.nombre_archivo,
          error: error.message,
          exito: false
        });
      }
    }

    return new Response(JSON.stringify({
      exito: true,
      procesados: resultados.length,
      resultados: resultados
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error en extract-valoraciones:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extraerValoraciones(texto: string) {
  const valoraciones = [];
  
  // Patrones para detectar valoraciones numéricas
  const patrones = [
    /([A-Za-záéíóúñÁÉÍÓÚÑ\s]+?)\s*[\:\-]?\s*(\d+)/g,
    /([A-Za-záéíóúñÁÉÍÓÚÑ\s]+?)\s*(\d+)/g
  ];

  // Criterios conocidos que buscamos
  const criteriosConocidos = [
    'formación básica',
    'formacion basica',
    'experiencia',
    'autonomía',
    'autonomia',
    'responsabilidad por equipo',
    'responsabilidad',
    'iniciativa',
    'liderazgo',
    'comunicación',
    'comunicacion',
    'trabajo en equipo',
    'resolución de problemas',
    'resolucion de problemas'
  ];

  // Tomar las últimas 1000 caracteres del documento (donde suelen estar las valoraciones)
  const textoFinal = texto.slice(-1000).toLowerCase();
  
  for (const patron of patrones) {
    let match;
    while ((match = patron.exec(textoFinal)) !== null) {
      const criterioTexto = match[1].trim().toLowerCase();
      const puntuacion = parseInt(match[2]);
      
      // Verificar si coincide con algún criterio conocido
      const criterioEncontrado = criteriosConocidos.find(c => 
        criterioTexto.includes(c) || c.includes(criterioTexto)
      );
      
      if (criterioEncontrado && puntuacion >= 1 && puntuacion <= 5) {
        // Normalizar el nombre del criterio
        let criterioNormalizado = criterioEncontrado;
        if (criterioEncontrado.includes('formacion') || criterioEncontrado.includes('formación')) {
          criterioNormalizado = 'Formación básica';
        } else if (criterioEncontrado === 'experiencia') {
          criterioNormalizado = 'Experiencia';
        } else if (criterioEncontrado.includes('autonomia') || criterioEncontrado.includes('autonomía')) {
          criterioNormalizado = 'Autonomía';
        } else if (criterioEncontrado.includes('responsabilidad')) {
          criterioNormalizado = 'Responsabilidad por equipo';
        } else if (criterioEncontrado === 'iniciativa') {
          criterioNormalizado = 'Iniciativa';
        }
        
        // Evitar duplicados
        if (!valoraciones.find(v => v.criterio === criterioNormalizado)) {
          valoraciones.push({
            criterio: criterioNormalizado,
            puntuacion: puntuacion,
            textoOriginal: match[0]
          });
        }
      }
    }
  }

  return valoraciones;
}