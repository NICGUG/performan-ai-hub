import { useState, useEffect } from "react";
import { Search, Filter, Plus, Building2, Eye, Edit, MoreHorizontal, FileText, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Puesto {
  id: string;
  titulo: string;
  area: string;
  ubicacion: string;
  estado: string;
  fecha_creacion: string;
  propietario: string;
  ultima_accion: string;
  descripcion?: string;
}

interface DocumentoPuesto {
  id: string;
  puesto_id: string;
  nombre_archivo: string;
  ruta_archivo: string;
  fecha_subida: string;
}

const getStatusColor = (estado: string) => {
  switch (estado) {
    case "Publicado":
      return "bg-success text-success-foreground";
    case "En revisión":
      return "bg-warning text-warning-foreground";
    case "Borrador":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Puestos() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("todos");
  const [puestos, setPuestos] = useState<Puesto[]>([]);
  const [documentos, setDocumentos] = useState<Record<string, DocumentoPuesto[]>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPuestos();
  }, []);

  const fetchPuestos = async () => {
    try {
      const { data, error } = await supabase
        .from('puestos')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      setPuestos(data || []);
      
      // Fetch documents for each position
      if (data && data.length > 0) {
        await fetchDocumentos(data.map(p => p.id));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los puestos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentos = async (puestoIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('documentos_puesto')
        .select('*')
        .in('puesto_id', puestoIds);

      if (error) throw error;
      
      const docsGrouped = (data || []).reduce((acc, doc) => {
        if (!acc[doc.puesto_id]) acc[doc.puesto_id] = [];
        acc[doc.puesto_id].push(doc);
        return acc;
      }, {} as Record<string, DocumentoPuesto[]>);
      
      setDocumentos(docsGrouped);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileUpload = async (puestoId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${puestoId}_${Date.now()}.${fileExt}`;
      const filePath = `documentos/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save document reference in database
      const { error: dbError } = await supabase
        .from('documentos_puesto')
        .insert({
          puesto_id: puestoId,
          nombre_archivo: file.name,
          ruta_archivo: filePath
        });

      if (dbError) throw dbError;

      toast({
        title: "Éxito",
        description: "Documento subido correctamente"
      });

      // Refresh documents
      await fetchDocumentos([puestoId]);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo subir el documento",
        variant: "destructive"
      });
    }
  };

  const handleFileDownload = async (documento: DocumentoPuesto) => {
    try {
      const { data, error } = await supabase.storage
        .from('documentos')
        .download(documento.ruta_archivo);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = documento.nombre_archivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el documento",
        variant: "destructive"
      });
    }
  };

  const filteredPuestos = puestos.filter(puesto => 
    puesto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puesto.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPuestosByStatus = (status: string) => {
    if (status === "todos") return filteredPuestos;
    return filteredPuestos.filter(p => p.estado.toLowerCase() === status.toLowerCase());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-muted-foreground">Cargando puestos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Puestos</h1>
          <p className="text-muted-foreground">
            Crea, edita y gestiona descripciones de puestos con IA integrada.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Puesto
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por título, área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="todos">Todos ({puestos.length})</TabsTrigger>
          <TabsTrigger value="borrador">Borrador ({getPuestosByStatus("borrador").length})</TabsTrigger>
          <TabsTrigger value="en revisión">En Revisión ({getPuestosByStatus("en revisión").length})</TabsTrigger>
          <TabsTrigger value="publicado">Publicados ({getPuestosByStatus("publicado").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {getPuestosByStatus(selectedTab).map((puesto) => (
            <Card key={puesto.id} className="shadow-card hover:shadow-floating transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold">{puesto.titulo}</h3>
                      <Badge className={getStatusColor(puesto.estado)}>
                        {puesto.estado}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Área:</span> {puesto.area}
                      </div>
                      <div>
                        <span className="font-medium">Ubicación:</span> {puesto.ubicacion}
                      </div>
                      <div>
                        <span className="font-medium">Propietario:</span> {puesto.propietario}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium">Última acción:</span> {puesto.ultima_accion}
                    </div>

                    {/* Documentos section */}
                    {documentos[puesto.id] && documentos[puesto.id].length > 0 && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium">Documentos ({documentos[puesto.id].length})</span>
                        </div>
                        <div className="space-y-1">
                          {documentos[puesto.id].map((doc) => (
                            <div key={doc.id} className="flex items-center justify-between text-xs">
                              <span className="truncate">{doc.nombre_archivo}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleFileDownload(doc)}
                                className="h-6 px-2"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <input
                      type="file"
                      accept=".doc,.docx,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload(puesto.id, file);
                        }
                      }}
                      className="hidden"
                      id={`file-upload-${puesto.id}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`file-upload-${puesto.id}`)?.click()}
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Subir
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicar</DropdownMenuItem>
                        <DropdownMenuItem>Historial</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}