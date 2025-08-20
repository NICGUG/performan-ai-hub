import { useState } from "react";
import { Bot, Zap, Clock, CheckCircle2, AlertCircle, Settings, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const mockRequests = [
  {
    id: "req_001",
    tipo: "Generación de Descripción",
    puesto: "Operador de Báscula",
    estado: "Completado",
    fechaCreacion: "2024-01-15 10:30",
    tiempoProceso: "2.3 min",
    estilo: "Atlantic Copper 2025",
    sector: "Minería",
  },
  {
    id: "req_002", 
    tipo: "Clasificación de Skills",
    puesto: "Técnico Ambiental",
    estado: "Procesando",
    fechaCreacion: "2024-01-15 14:15",
    tiempoProceso: "1.1 min",
    estilo: "Energía",
    sector: "Medio Ambiente",
    progreso: 65,
  },
  {
    id: "req_003",
    tipo: "Generación de Descripción",
    puesto: "Supervisor Nocturno",
    estado: "En Cola",
    fechaCreacion: "2024-01-15 15:45",
    tiempoProceso: "-",
    estilo: "Atlantic Copper 2025",
    sector: "Operaciones",
  },
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Completado":
      return "bg-success text-success-foreground";
    case "Procesando":
      return "bg-warning text-warning-foreground";
    case "En Cola":
      return "bg-secondary text-secondary-foreground";
    case "Error":
      return "bg-destructive text-destructive-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getEstadoIcon = (estado: string) => {
  switch (estado) {
    case "Completado":
      return CheckCircle2;
    case "Procesando":
      return Clock;
    case "En Cola":
      return Clock;
    case "Error":
      return AlertCircle;
    default:
      return Clock;
  }
};

export default function IA() {
  const [selectedTab, setSelectedTab] = useState("generator");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IA & Automatizaciones</h1>
          <p className="text-muted-foreground">
            Genera descripciones con IA y gestiona la integración con n8n.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar n8n
          </Button>
          <Button>
            <Bot className="w-4 h-4 mr-2" />
            Nueva Generación IA
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cola</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procesando</CardTitle>
            <Zap className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completados Hoy</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Medio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1m</div>
            <p className="text-xs text-muted-foreground">
              Por generación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="generator">Generador IA</TabsTrigger>
          <TabsTrigger value="requests">Historial de Solicitudes</TabsTrigger>
          <TabsTrigger value="styles">Estilos y Plantillas</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                Generar Descripción de Puesto con IA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sector">Sector</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mineria">Minería</SelectItem>
                      <SelectItem value="energia">Energía</SelectItem>
                      <SelectItem value="seguros">Seguros</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estilo">Estilo de Redacción</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estilo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atlantic-copper">Atlantic Copper 2025</SelectItem>
                      <SelectItem value="energia-renovable">Energía Renovable</SelectItem>
                      <SelectItem value="seguros-corporativo">Seguros Corporativo</SelectItem>
                      <SelectItem value="retail-moderno">Retail Moderno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notas">Notas adicionales</Label>
                <Textarea 
                  id="notas"
                  placeholder="Información específica, terminología interna, requisitos especiales..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button className="bg-gradient-primary">
                  <Play className="w-4 h-4 mr-2" />
                  Generar con IA (n8n)
                </Button>
                <Badge variant="outline" className="text-xs">
                  ~2 min de procesamiento
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          {mockRequests.map((request) => {
            const EstadoIcon = getEstadoIcon(request.estado);
            
            return (
              <Card key={request.id} className="shadow-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <EstadoIcon className="w-5 h-5 mt-0.5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{request.tipo}</h3>
                        <p className="text-sm text-muted-foreground">
                          Puesto: {request.puesto}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>ID: {request.id}</span>
                          <span>Creado: {request.fechaCreacion}</span>
                          <span>Tiempo: {request.tiempoProceso}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={getEstadoColor(request.estado)}>
                          {request.estado}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          {request.estilo}
                        </div>
                      </div>
                      
                      {request.estado === "Procesando" && request.progreso && (
                        <div className="w-24">
                          <Progress value={request.progreso} className="h-2" />
                          <div className="text-xs text-center mt-1">{request.progreso}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="styles">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Estilos de Redacción Disponibles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {[
                  { nombre: "Atlantic Copper 2025", sector: "Minería", descripcion: "Estilo formal con tareas en gerundio y terminología específica" },
                  { nombre: "Energía Renovable", sector: "Energía", descripcion: "Enfoque en sostenibilidad y tecnologías limpias" },
                  { nombre: "Seguros Corporativo", sector: "Seguros", descripcion: "Lenguaje técnico financiero y regulatorio" },
                  { nombre: "Retail Moderno", sector: "Retail", descripcion: "Dinámico, orientado al cliente y digital" },
                ].map((estilo, index) => (
                  <Card key={index} className="border">
                    <CardContent className="pt-4">
                      <h4 className="font-medium">{estilo.nombre}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{estilo.descripcion}</p>
                      <Badge variant="outline" className="mt-2">{estilo.sector}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}