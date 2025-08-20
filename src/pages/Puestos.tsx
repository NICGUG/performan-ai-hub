import { useState } from "react";
import { Search, Filter, Plus, Building2, Eye, Edit, MoreHorizontal } from "lucide-react";
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

const mockPuestos = [
  {
    id: "1",
    titulo: "Operador de Báscula",
    area: "Operaciones",
    ubicacion: "Planta Principal",
    estado: "En revisión",
    fechaCreacion: "2024-01-15",
    propietario: "Ana García",
    ultimaAccion: "Generación IA completada",
  },
  {
    id: "2", 
    titulo: "Técnico Aux. Gestión Ambiental",
    area: "Medio Ambiente",
    ubicacion: "Todas las instalaciones",
    estado: "Publicado",
    fechaCreacion: "2024-01-10",
    propietario: "Carlos Ruiz",
    ultimaAccion: "Publicado en portal",
  },
  {
    id: "3",
    titulo: "Supervisor de Operaciones",
    area: "Operaciones",
    ubicacion: "Turno Noche",
    estado: "Borrador",
    fechaCreacion: "2024-01-12",
    propietario: "María López",
    ultimaAccion: "Pendiente revisión IA",
  },
];

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

  const filteredPuestos = mockPuestos.filter(puesto => 
    puesto.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    puesto.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <TabsTrigger value="todos">Todos ({mockPuestos.length})</TabsTrigger>
          <TabsTrigger value="borrador">Borrador (1)</TabsTrigger>
          <TabsTrigger value="revision">En Revisión (1)</TabsTrigger>
          <TabsTrigger value="publicado">Publicados (1)</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {filteredPuestos.map((puesto) => (
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
                      <span className="font-medium">Última acción:</span> {puesto.ultimaAccion}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
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