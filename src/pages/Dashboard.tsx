import {
  Building2,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { TaskItem } from "@/components/dashboard/TaskItem";

const mockTasks = [
  {
    title: "Revisar descripción: Operador de Báscula",
    description: "Descripción generada por IA lista para revisión y aprobación",
    priority: "high" as const,
    status: "pending" as const,
    dueTime: "Hoy",
  },
  {
    title: "Entrevista Técnico Aux. Gestión Ambiental", 
    description: "Entrevista estructurada programada con candidato preseleccionado",
    priority: "high" as const,
    status: "in-progress" as const,
    dueTime: "12:00",
  },
  {
    title: "Aprobar publicación: Supervisor de Operaciones",
    description: "Descripción completa pendiente de aprobación final",
    priority: "medium" as const,
    status: "pending" as const,
    dueTime: "Mañana",
  },
  {
    title: "Evaluación competencias: Analista de Procesos",
    description: "Candidato ha completado pruebas técnicas, pendiente scoring",
    priority: "medium" as const,
    status: "pending" as const,
    dueTime: "2 días",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido/a al Hub Técnico de Performan. Gestiona puestos, candidatos y evaluaciones.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Reportes
          </Button>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Nuevo Puesto
          </Button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Puestos Activos"
          value={23}
          icon={Building2}
          description="En diferentes fases"
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <KPICard
          title="Candidatos en Proceso"
          value={47}
          icon={Users}
          description="Evaluaciones en curso"
          trend={{ value: 8, isPositive: true }}
          variant="success"
        />
        <KPICard
          title="Tiempo Medio a Publicación"
          value="2.3h"
          icon={Clock}
          description="Desde IA a aprobación"
          trend={{ value: 15, isPositive: false }}
          variant="warning"
        />
        <KPICard
          title="Evaluaciones Completadas"
          value="89%"
          icon={CheckCircle2}
          description="Esta semana"
          trend={{ value: 5, isPositive: true }}
          variant="success"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tasks Panel */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Bandeja de Tareas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockTasks.map((task, index) => (
                <TaskItem key={index} {...task} />
              ))}
              
              <div className="pt-3 border-t">
                <Button variant="outline" className="w-full">
                  Ver todas las tareas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* AI Status */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Estado IA (n8n)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">En cola</span>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Procesando</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completados hoy</span>
                <span className="text-sm font-medium text-success">7</span>
              </div>
              
              <Button variant="outline" size="sm" className="w-full mt-3">
                Ver historial IA
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Puestos creados hoy</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-muted-foreground">Entrevistas programadas</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Evaluaciones cerradas</span>
                  <span className="font-medium text-success">12</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}