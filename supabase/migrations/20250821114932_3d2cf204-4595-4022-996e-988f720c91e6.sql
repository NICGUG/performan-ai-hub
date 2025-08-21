-- Crear la tabla de puestos
CREATE TABLE public.puestos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  area TEXT NOT NULL,
  ubicacion TEXT,
  estado TEXT NOT NULL DEFAULT 'Borrador',
  fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  propietario TEXT,
  ultima_accion TEXT,
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear la tabla de documentos de puesto
CREATE TABLE public.documentos_puesto (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  puesto_id UUID NOT NULL REFERENCES public.puestos(id) ON DELETE CASCADE,
  nombre_archivo TEXT NOT NULL,
  ruta_archivo TEXT NOT NULL,
  fecha_subida TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Crear la tabla de evaluaciones de puesto (opcional)
CREATE TABLE public.evaluaciones_puesto (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  puesto_id UUID NOT NULL REFERENCES public.puestos(id) ON DELETE CASCADE,
  criterio TEXT NOT NULL,
  puntuacion INTEGER,
  comentarios TEXT,
  fecha_evaluacion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.puestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_puesto ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluaciones_puesto ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS (acceso completo por ahora)
CREATE POLICY "Acceso completo a puestos" ON public.puestos
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso completo a documentos_puesto" ON public.documentos_puesto
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Acceso completo a evaluaciones_puesto" ON public.evaluaciones_puesto
FOR ALL USING (true) WITH CHECK (true);

-- Crear bucket de storage para documentos
INSERT INTO storage.buckets (id, name, public) VALUES ('documentos', 'documentos', false);

-- Crear políticas de storage para acceso completo
CREATE POLICY "Acceso completo a documentos storage" ON storage.objects
FOR ALL USING (bucket_id = 'documentos') WITH CHECK (bucket_id = 'documentos');

-- Crear función para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_puestos_updated_at
  BEFORE UPDATE ON public.puestos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentos_puesto_updated_at
  BEFORE UPDATE ON public.documentos_puesto
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_evaluaciones_puesto_updated_at
  BEFORE UPDATE ON public.evaluaciones_puesto
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO public.puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion) VALUES
('Operador de Báscula', 'Operaciones', 'Planta Principal', 'En revisión', 'Ana García', 'Generación IA completada', 'Puesto encargado del manejo y control de la báscula principal de la planta.'),
('Técnico Aux. Gestión Ambiental', 'Medio Ambiente', 'Todas las instalaciones', 'Publicado', 'Carlos Ruiz', 'Publicado en portal', 'Apoyo técnico en la gestión ambiental de todas las instalaciones de la empresa.'),
('Supervisor de Operaciones', 'Operaciones', 'Turno Noche', 'Borrador', 'María López', 'Pendiente revisión IA', 'Supervisión de las operaciones durante el turno nocturno.');