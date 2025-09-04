import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, FileText, Brain, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ProcesarDocumentosButton = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const procesarTodosLosDocumentos = async () => {
    setIsProcessing(true);

    try {
      // Obtener todos los documentos
      const { data: documentos, error: docError } = await supabase
        .from('documentos_puesto')
        .select('id, nombre_archivo');

      if (docError) throw docError;

      if (!documentos || documentos.length === 0) {
        toast({
          title: "Sin documentos",
          description: "No hay documentos para procesar",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Procesando documentos",
        description: `Iniciando extracción de ${documentos.length} documentos...`,
      });

      // Llamar a la función edge para procesar todos
      const { data, error } = await supabase.functions.invoke('extract-valoraciones', {
        body: {
          procesarTodos: true
        }
      });

      if (error) throw error;

      const exitosos = data.resultados?.filter((r: any) => r.exito).length || 0;
      const total = data.resultados?.length || 0;

      toast({
        title: "Extracción completada",
        description: `Se procesaron ${exitosos} de ${total} documentos exitosamente`,
        variant: exitosos === total ? "default" : "destructive",
      });

      // Refrescar la página para mostrar los nuevos datos
      window.location.reload();

    } catch (error) {
      console.error('Error al procesar documentos:', error);
      toast({
        title: "Error",
        description: "Error al procesar los documentos",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Extraer Valoraciones de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Para mostrar las valoraciones en analíticas, primero necesitas extraer las valoraciones de los documentos Word.
          Este proceso busca automáticamente criterios como "Formación básica", "Experiencia", "Iniciativa", etc.
        </p>
        
        <Button 
          onClick={procesarTodosLosDocumentos}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Procesando documentos...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Procesar Todos los Documentos
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};