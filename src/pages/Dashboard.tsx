import { useState, useEffect } from "react";
import { Building2, Bot, TrendingUp, Calendar, Clock, CheckCircle, AlertCircle, MessageCircle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPICard } from "@/components/dashboard/KPICard";
import { TaskItem } from "@/components/dashboard/TaskItem";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CalendarEvent {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha_inicio: string;
  tipo: string;
  estado: string;
  prioridad: string;
}

export default function Dashboard() {
  const [proximasEvaluaciones, setProximasEvaluaciones] = useState<CalendarEvent[]>([]);
  const { user } = useAuth();

  // Cargar próximas evaluaciones desde el calendario
  const loadProximasEvaluaciones = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('eventos_calendario')
        .select('*')
        .eq('user_id', user.id)
        .gte('fecha_inicio', new Date().toISOString())
        .order('fecha_inicio', { ascending: true })
        .limit(5);

      if (error) throw error;
      setProximasEvaluaciones(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  useEffect(() => {
    loadProximasEvaluaciones();
  }, [user]);

  // Convertir eventos del calendario a tareas para la bandeja
  const calendarTasks = proximasEvaluaciones.slice(0, 3).map((evento) => ({
    id: evento.id,
    title: evento.titulo,
    description: evento.descripcion || `${evento.tipo} programado`,
    priority: evento.prioridad === 'alta' ? 'high' as const : 
              evento.prioridad === 'media' ? 'medium' as const : 'low' as const,
    status: evento.estado === 'completado' ? 'completed' as const : 
            evento.estado === 'programado' ? 'pending' as const : 'in-progress' as const,
    dueTime: format(new Date(evento.fecha_inicio), "HH:mm"),
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-medium tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Bienvenido/a al Hub de Puestos con IA. Gestiona descripciones y coordinación interna.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg">
            <TrendingUp className="w-4 h-4 mr-2" />
            Ver Analíticas
          </Button>
          <Button size="lg">
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
          value={proximasEvaluaciones.length.toString()}
          icon={Calendar}
          description="Esta semana"
          trend={{ value: 5.7, isPositive: true }}
        />
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Tasks Section */}
        <Card className="p-1">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Bandeja de Tareas</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {calendarTasks.length > 0 ? (
                calendarTasks.map((task) => (
                  <TaskItem key={task.id} {...task} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No hay tareas pendientes. Crea eventos en el calendario.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Próximas Evaluaciones */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proximasEvaluaciones.length > 0 ? (
                proximasEvaluaciones.map((evaluacion) => (
                  <div key={evaluacion.id} className="flex items-start justify-between p-2 border rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{evaluacion.titulo}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(evaluacion.fecha_inicio), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <span className="text-xs bg-muted px-1 rounded capitalize">{evaluacion.tipo}</span>
                        <span className="text-xs bg-muted px-1 rounded capitalize">{evaluacion.prioridad}</span>
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay eventos próximos. Ve al calendario para crear uno.
                </p>
              )}
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
              <div className="text-sm">
                <p>
                  <span className="font-medium">Sistema</span>{" "}
                  actualizó la información del calendario
                </p>
                <p className="text-xs text-muted-foreground">hace 2 min</p>
              </div>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Usuario</span>{" "}
                  creó un nuevo evento en el calendario
                </p>
                <p className="text-xs text-muted-foreground">hace 15 min</p>
              </div>
              <div className="text-sm">
                <p>
                  <span className="font-medium">Sistema</span>{" "}
                  sincronizó eventos con la base de datos
                </p>
                <p className="text-xs text-muted-foreground">hace 1 hora</p>
              </div>
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