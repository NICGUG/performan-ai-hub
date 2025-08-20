import { useState } from "react";
import { Sparkles, Upload, Settings, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const mockRequests = [
  {
    id: "1",
    titulo: "Operador de Báscula",
    estado: "procesando",
    fechaCreacion: "2024-01-15T10:30:00",
    sector: "Energía",
    estilo: "Atlantic Copper 2025",
    progreso: 75,
  },
  {
    id: "2",
    titulo: "Técnico Aux. Gestión Ambiental",
    estado: "devuelto",
    fechaCreacion: "2024-01-14T14:20:00",
    sector: "Medio Ambiente",
    estilo: "Atlantic Copper 2025",
    resultado: "Descripción generada exitosamente",
  },
  {
    id: "3",
    titulo: "Supervisor de Operaciones",
    estado: "en_cola",
    fechaCreacion: "2024-01-15T16:45:00",
    sector: "Operaciones",
    estilo: "Atlantic Copper 2025",
  },
];

const getStatusColor = (estado: string) => {
  switch (estado) {
    case "devuelto":
      return "bg-success text-success-foreground";
    case "procesando":
      return "bg-warning text-warning-foreground";
    case "en_cola":
      return "bg-muted text-muted-foreground";
    case "error":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusIcon = (estado: string) => {
  switch (estado) {
    case "devuelto":
      return CheckCircle;
    case "procesando":
      return Loader2;
    case "en_cola":
      return Clock;
    case "error":
      return AlertCircle;
    default:
      return Clock;
  }
};

export default function GeneradorDescripciones() {
  const [activeTab, setActiveTab] = useState("nuevo");
  const [formData, setFormData] = useState({
    titulo: "",
    sector: "",
    estilo: "",
    idioma: "es-ES",
    notas: "",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generador de Descripciones</h1>
          <p className="text-muted-foreground">
            Genera descripciones de puestos con IA integrada y n8n.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="nuevo">Generar Nueva</TabsTrigger>
          <TabsTrigger value="cola">Cola de Procesos ({mockRequests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="nuevo" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Nueva Generación con IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título del Puesto</Label>
                  <Input
                    id="titulo"
                    placeholder="Ej: Operador de Báscula"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="energia">Energía</SelectItem>
                      <SelectItem value="seguros">Seguros</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="operaciones">Operaciones</SelectItem>
                      <SelectItem value="medioambiente">Medio Ambiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estilo">Estilo de Redacción</Label>
                  <Select value={formData.estilo} onValueChange={(value) => setFormData({ ...formData, estilo: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atlantic-copper-2025">Atlantic Copper 2025</SelectItem>
                      <SelectItem value="seguros-general">Seguros General</SelectItem>
                      <SelectItem value="energia-tecnico">Energía Técnico</SelectItem>
                      <SelectItem value="retail-comercial">Retail Comercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idioma">Idioma</Label>
                  <Select value={formData.idioma} onValueChange={(value) => setFormData({ ...formData, idioma: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es-ES">Español (España)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea
                  id="notas"
                  placeholder="Incluye detalles específicos, terminología interna, o documentos de referencia..."
                  rows={4}
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                />
              </div>

              <div className="space-y-4">
                <Label>Documentos Adjuntos</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <Button variant="outline" size="sm">
                    Seleccionar Archivos
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configuración Avanzada
                </Button>
                <Button>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar con IA (n8n)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cola" className="space-y-4">
          {mockRequests.map((request) => {
            const StatusIcon = getStatusIcon(request.estado);
            return (
              <Card key={request.id} className="shadow-card hover:shadow-floating transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${request.estado === "procesando" ? "animate-spin" : ""}`} />
                        <h3 className="text-lg font-semibold">{request.titulo}</h3>
                        <Badge className={getStatusColor(request.estado)}>
                          {request.estado.replace("_", " ")}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Sector:</span> {request.sector}
                        </div>
                        <div>
                          <span className="font-medium">Estilo:</span> {request.estilo}
                        </div>
                        <div>
                          <span className="font-medium">Creado:</span> {new Date(request.fechaCreacion).toLocaleString("es-ES")}
                        </div>
                      </div>

                      {request.progreso && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso</span>
                            <span>{request.progreso}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${request.progreso}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {request.resultado && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <span className="font-medium">Resultado:</span> {request.resultado}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {request.estado === "devuelto" && (
                        <Button variant="outline" size="sm">
                          Ver Resultado
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        Detalles
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}