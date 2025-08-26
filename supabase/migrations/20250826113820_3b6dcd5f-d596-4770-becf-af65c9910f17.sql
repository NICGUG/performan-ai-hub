-- Create table for calendar events
CREATE TABLE public.eventos_calendario (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE,
  tipo TEXT NOT NULL DEFAULT 'evento', -- 'evento', 'tarea', 'reunion'
  estado TEXT NOT NULL DEFAULT 'programado', -- 'programado', 'completado', 'cancelado'
  prioridad TEXT NOT NULL DEFAULT 'media', -- 'alta', 'media', 'baja'
  puesto_relacionado UUID REFERENCES public.puestos(id),
  recordatorios TEXT[] DEFAULT '{}', -- Array of reminder times like ['24h', '1h']
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.eventos_calendario ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own events" 
ON public.eventos_calendario 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" 
ON public.eventos_calendario 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
ON public.eventos_calendario 
FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
ON public.eventos_calendario 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_eventos_calendario_updated_at
BEFORE UPDATE ON public.eventos_calendario
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_eventos_calendario_user_fecha ON public.eventos_calendario(user_id, fecha_inicio);
CREATE INDEX idx_eventos_calendario_tipo ON public.eventos_calendario(tipo);
CREATE INDEX idx_eventos_calendario_estado ON public.eventos_calendario(estado);