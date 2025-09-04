-- Create table for extracted ratings from Word documents
CREATE TABLE public.valoraciones_documentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  documento_id UUID NOT NULL REFERENCES public.documentos_puesto(id) ON DELETE CASCADE,
  puesto_id UUID NOT NULL REFERENCES public.puestos(id) ON DELETE CASCADE,
  criterio TEXT NOT NULL,
  puntuacion INTEGER NOT NULL,
  fecha_extraccion TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metodo_extraccion TEXT NOT NULL DEFAULT 'automatico',
  texto_original TEXT,
  revisado BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.valoraciones_documentos ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can view valoraciones_documentos" 
ON public.valoraciones_documentos 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create valoraciones_documentos" 
ON public.valoraciones_documentos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update valoraciones_documentos" 
ON public.valoraciones_documentos 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete valoraciones_documentos" 
ON public.valoraciones_documentos 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_valoraciones_documentos_updated_at
BEFORE UPDATE ON public.valoraciones_documentos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_valoraciones_documentos_documento_id ON public.valoraciones_documentos(documento_id);
CREATE INDEX idx_valoraciones_documentos_puesto_id ON public.valoraciones_documentos(puesto_id);
CREATE INDEX idx_valoraciones_documentos_criterio ON public.valoraciones_documentos(criterio);