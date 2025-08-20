import { Building2, Bot, TrendingUp, Calendar, Clock, CheckCircle, AlertCircle, MessageCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { TaskItem } from "@/components/dashboard/TaskItem";

const mockTasks = [
  {
    id: "1",
    title: "Revisar descripción generada",
    description: "Operador de Báscula - IA completada",
    priority: "high" as const,
    status: "pending" as const,
    dueTime: "10:30",
  },
  {
    id: "2",
    title: "Evaluación de puesto programada",
    description: "Técnico Aux. Gestión Ambiental",
    priority: "medium" as const,
    status: "in-progress" as const,
    dueTime: "14:00",
  },
  {
    id: "3",
    title: "Aprobar publicación",
    description: "Supervisor de Operaciones",
    priority: "low" as const,
    status: "pending" as const,
    dueTime: "16:00",
  },
];

const mockProximasEvaluaciones = [
  {
    id: "1",
    titulo: "Evaluación de puesto — Operador de Báscula",
    fecha: "2024-01-22",
    hora: "10:00",
    puesto: "Operador de Báscula",
  },
  {
    id: "2",
    titulo: "Evaluación de puesto — Técnico Aux. Gestión Ambiental",
    fecha: "2024-01-23",
    hora: "14:30",
    puesto: "Técnico Aux. Gestión Ambiental",
  },
];

const mockActividadReciente = [
  {
    id: "1",
    usuario: "Coordinador",
    accion: "ha revisado la descripción de",
    objeto: "Operador de Báscula",
    timestamp: "hace 5 min",
  },
  {
    id: "2",
    usuario: "IA (n8n)",
    accion: "completó la generación para",
    objeto: "Técnico Aux. Gestión Ambiental",
    timestamp: "hace 12 min",
  },
  {
    id: "3",
    usuario: "Coordinador",
    accion: "programó evaluación para",
    objeto: "Supervisor de Operaciones",
    timestamp: "hace 1 hora",
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
            Bienvenido/a al Hub de Puestos con IA. Gestiona descripciones y coordinación interna.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Analíticas
          </Button>
          <Button>
            <Building2 className="w-4 h-4 mr-2" />
            Nuevo Puesto
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Puestos Activos"
          value="24"
          icon={Building2}
          description="3 nuevos esta semana"
          trend={{ value: 12.5, isPositive: true }}
        />
        <KPICard
          title="Tiempo Medio a Publicación"
          value="2.3h"
          icon={Clock}
          description="Mejora del 15%"
          trend={{ value: 15.0, isPositive: true }}
        />
        <KPICard
          title="Ejecuciones n8n"
          value="18"
          icon={Bot}
          description="2 en proceso"
          trend={{ value: 15.3, isPositive: true }}
        />
        <KPICard
          title="Evaluaciones Programadas"
          value="7"
          icon={Calendar}
          description="Esta semana"
          trend={{ value: 5.7, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Tasks Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Bandeja de Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTasks.map((task) => (
                <TaskItem key={task.id} {...task} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Evaluaciones */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Próximas Evaluaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockProximasEvaluaciones.map((evaluacion) => (
                <div key={evaluacion.id} className="flex items-start justify-between p-2 border rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{evaluacion.puesto}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(evaluacion.fecha).toLocaleDateString("es-ES")} a las {evaluacion.hora}
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente del Chat */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActividadReciente.map((actividad) => (
                <div key={actividad.id} className="text-sm">
                  <p>
                    <span className="font-medium">{actividad.usuario}</span>{" "}
                    {actividad.accion}{" "}
                    <span className="font-medium">{actividad.objeto}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{actividad.timestamp}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Status Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Estado de Ejecuciones n8n
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Procesando</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">2</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">En cola</span>
              <span className="text-sm font-medium">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completados hoy</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-sm font-medium">8</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Errores</span>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium">0</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}