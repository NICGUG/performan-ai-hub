import { useState } from "react";
import { Search, Filter, Plus, Users, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockCandidatos = [
  {
    id: "1",
    nombre: "Elena Martínez",
    email: "elena.martinez@email.com",
    telefono: "+34 600 123 456",
    ubicacion: "Madrid, España",
    puesto: "Técnico Aux. Gestión Ambiental",
    fase: "Entrevista",
    fechaAplicacion: "2024-01-10",
    puntuacion: 8.5,
    avatar: null,
  },
  {
    id: "2",
    nombre: "David Rodríguez",
    email: "david.rodriguez@email.com", 
    telefono: "+34 600 234 567",
    ubicacion: "Sevilla, España",
    puesto: "Operador de Báscula",
    fase: "Screening",
    fechaAplicacion: "2024-01-12",
    puntuacion: 7.8,
    avatar: null,
  },
  {
    id: "3",
    nombre: "Carmen Jiménez",
    email: "carmen.jimenez@email.com",
    telefono: "+34 600 345 678",
    ubicacion: "Valencia, España", 
    puesto: "Supervisor de Operaciones",
    fase: "Pruebas",
    fechaAplicacion: "2024-01-08",
    puntuacion: 9.2,
    avatar: null,
  },
];

const getFaseColor = (fase: string) => {
  switch (fase) {
    case "Entrevista":
      return "bg-warning text-warning-foreground";
    case "Screening":
      return "bg-secondary text-secondary-foreground";
    case "Pruebas":
      return "bg-primary text-primary-foreground";
    case "Oferta":
      return "bg-success text-success-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Candidatos() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCandidatos = mockCandidatos.filter(candidato =>
    candidato.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidato.puesto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Candidatos</h1>
          <p className="text-muted-foreground">
            Gestiona candidatos y su progreso en el proceso de selección.
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Candidato
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, puesto..."
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

      {/* Candidates List */}
      <div className="grid gap-4">
        {filteredCandidatos.map((candidato) => (
          <Card key={candidato.id} className="shadow-card hover:shadow-floating transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={candidato.avatar || ""} alt={candidato.nombre} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {candidato.nombre.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{candidato.nombre}</h3>
                    <Badge className={getFaseColor(candidato.fase)}>
                      {candidato.fase}
                    </Badge>
                    <div className="ml-auto flex items-center gap-1">
                      <span className="text-sm font-medium">Puntuación:</span>
                      <span className="text-sm text-primary font-bold">
                        {candidato.puntuacion}/10
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{candidato.puesto}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{candidato.ubicacion}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Aplicó: {candidato.fechaAplicacion}</span>
                    </div>
                    <div>
                      <span>{candidato.email}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                    <Button variant="outline" size="sm">
                      Programar Entrevista
                    </Button>
                    <Button variant="outline" size="sm">
                      Evaluaciones
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}