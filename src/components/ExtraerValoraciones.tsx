import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, FileText, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExtraerValoracionesProps {
  documentoId?: string;
  onSuccess?: () => void;
}

interface ResultadoExtraccion {
  documento_id: string;
  nombre_archivo: string;
  valoraciones_encontradas: number;
  valoraciones: Array<{
    criterio: string;
    puntuacion: number;
    textoOriginal: string;
  }>;
  exito: boolean;
  error?: string;
}

export const ExtraerValoraciones = ({ documentoId, onSuccess }: ExtraerValoracionesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultados, setResultados] = useState<ResultadoExtraccion[]>([]);
  const { toast } = useToast();

  const procesarDocumentos = async (procesarTodos = false) => {
    setIsProcessing(true);
    setProgress(0);
    setResultados([]);

    try {
      const { data, error } = await supabase.functions.invoke('extract-valoraciones', {
        body: {
          documentoId: procesarTodos ? null : documentoId,
          procesarTodos
        }
      });

      if (error) throw error;

      setResultados(data.resultados || []);
      
      const exitosos = data.resultados?.filter((r: ResultadoExtraccion) => r.exito).length || 0;
      const total = data.resultados?.length || 0;

      toast({
        title: "Extracción completada",
        description: `Se procesaron ${exitosos} de ${total} documentos exitosamente`,
        variant: exitosos === total ? "default" : "destructive",
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error al extraer valoraciones:', error);
      toast({
        title: "Error",
        description: "Error al procesar las valoraciones de los documentos",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setIsOpen(false);
      setResultados([]);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Brain className="w-4 h-4 mr-1" />
          Extraer Valoraciones
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Extraer Valoraciones de Documentos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isProcessing && resultados.length === 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Esta función extrae automáticamente las valoraciones numéricas de los documentos Word.
                Busca criterios como "Formación básica", "Experiencia", "Iniciativa", etc.
              </p>
              
              <div className="flex gap-2">
                {documentoId && (
                  <Button onClick={() => procesarDocumentos(false)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Procesar este documento
                  </Button>
                )}
                <Button variant="outline" onClick={() => procesarDocumentos(true)}>
                  <Brain className="w-4 h-4 mr-2" />
                  Procesar todos los documentos
                </Button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Procesando documentos...</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {resultados.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resultados de la Extracción</h3>
                <div className="flex gap-2">
                  <Badge variant="outline">
                    {resultados.filter(r => r.exito).length} exitosos
                  </Badge>
                  <Badge variant="destructive">
                    {resultados.filter(r => !r.exito).length} con errores
                  </Badge>
                </div>
              </div>

              <ScrollArea className="h-[400px] w-full">
                <div className="space-y-3">
                  {resultados.map((resultado, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {resultado.exito ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium">{resultado.nombre_archivo}</span>
                        </div>
                        <Badge variant={resultado.exito ? "default" : "destructive"}>
                          {resultado.exito ? `${resultado.valoraciones_encontradas} valoraciones` : 'Error'}
                        </Badge>
                      </div>

                      {resultado.exito && resultado.valoraciones.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Valoraciones extraídas:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {resultado.valoraciones.map((val, valIndex) => (
                              <div key={valIndex} className="text-sm bg-muted p-2 rounded">
                                <span className="font-medium">{val.criterio}:</span> {val.puntuacion}
                                <br />
                                <span className="text-xs text-muted-foreground">"{val.textoOriginal}"</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {!resultado.exito && resultado.error && (
                        <p className="text-sm text-red-600">{resultado.error}</p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex justify-end">
                <Button onClick={handleClose}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};