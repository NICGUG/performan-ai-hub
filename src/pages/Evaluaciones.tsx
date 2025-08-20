import { ClipboardCheck, Users, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const mockEvaluaciones = [
  {
    id: "1",
    nombre: "Evaluación Técnica - Operaciones",
    tipo: "Prueba Técnica",
    candidatos: 12,
    completadas: 8,
    duracion: "45 min",
    competencias: ["Análisis", "Resolución de problemas", "Atención al detalle"],
    estado: "Activa",
  },
  {
    id: "2",
    nombre: "Entrevista Estructurada - Gestión Ambiental",
    tipo: "Entrevista",
    candidatos: 5,
    completadas: 3,
    duracion: "60 min", 
    competencias: ["Conocimiento normativo", "Comunicación", "Trabajo en equipo"],
    estado: "Activa",
  },
  {
    id: "3",
    nombre: "Assessment Center - Supervisión",
    tipo: "Assessment Center",
    candidatos: 8,
    completadas: 8,
    duracion: "180 min",
    competencias: ["Liderazgo", "Toma de decisiones", "Gestión de conflictos"],
    estado: "Completada",
  },
];

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Activa":
      return "bg-success text-success-foreground";
    case "Completada":
      return "bg-muted text-muted-foreground";
    case "Borrador":
      return "bg-warning text-warning-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Evaluaciones() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Evaluaciones</h1>
          <p className="text-muted-foreground">
            Gestiona pruebas técnicas, entrevistas estructuradas y evaluaciones de competencias.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reportes
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Evaluación
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones Activas</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 desde la semana pasada
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatos Evaluándose</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              En diferentes pruebas
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">
              +5% vs mes anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Evaluations List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Evaluaciones</h2>
        
        {mockEvaluaciones.map((evaluacion) => (
          <Card key={evaluacion.id} className="shadow-card hover:shadow-floating transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{evaluacion.nombre}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{evaluacion.tipo}</Badge>
                    <Badge className={getEstadoColor(evaluacion.estado)}>
                      {evaluacion.estado}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      Duración: {evaluacion.duracion}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso de candidatos</span>
                  <span>{evaluacion.completadas}/{evaluacion.candidatos}</span>
                </div>
                <Progress 
                  value={(evaluacion.completadas / evaluacion.candidatos) * 100} 
                  className="h-2"
                />
              </div>

              {/* Competencies */}
              <div>
                <h4 className="text-sm font-medium mb-2">Competencias evaluadas:</h4>
                <div className="flex flex-wrap gap-2">
                  {evaluacion.competencias.map((competencia, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {competencia}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">
                  Ver Resultados
                </Button>
                <Button variant="outline" size="sm">
                  Gestionar Candidatos
                </Button>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}