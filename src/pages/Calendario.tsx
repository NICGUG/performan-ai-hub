import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, ExternalLink, Download, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CalendarEvent {
  id: string;
  titulo: string;
  descripcion?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tipo: 'evento' | 'tarea' | 'reunion';
  estado: 'programado' | 'completado' | 'cancelado';
  prioridad: 'alta' | 'media' | 'baja';
  puesto_relacionado?: string;
  recordatorios: string[];
}

export default function Calendario() {
  const [selectedView, setSelectedView] = useState("mes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventos, setEventos] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 7, 25)); // 25 de agosto de 2025
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [newEvent, setNewEvent] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    hora: "",
    tipo: "evento" as const,
    prioridad: "media" as const,
    recordatorios: ["24h"],
  });

  // Cargar eventos desde Supabase
  const loadEventos = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('eventos_calendario')
        .select('*')
        .eq('user_id', user.id)
        .order('fecha_inicio', { ascending: true });

      if (error) throw error;
      
      // Mapear los datos para que coincidan con la interfaz CalendarEvent
      const eventosFormateados: CalendarEvent[] = (data || []).map(item => ({
        id: item.id,
        titulo: item.titulo,
        descripcion: item.descripcion,
        fecha_inicio: item.fecha_inicio,
        fecha_fin: item.fecha_fin,
        tipo: item.tipo as 'evento' | 'tarea' | 'reunion',
        estado: item.estado as 'programado' | 'completado' | 'cancelado',
        prioridad: item.prioridad as 'alta' | 'media' | 'baja',
        puesto_relacionado: item.puesto_relacionado,
        recordatorios: item.recordatorios || [],
      }));
      
      setEventos(eventosFormateados);
    } catch (error) {
      console.error('Error loading events:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventos();
  }, [user]);

  // Obtener eventos de hoy
  const hoyEventos = eventos.filter(evento => {
    const today = new Date(2025, 7, 25).toISOString().split('T')[0]; // 25 de agosto de 2025
    return evento.fecha_inicio.split('T')[0] === today;
  });

  // Obtener próximos eventos
  const upcomingEvents = eventos.filter(evento => {
    const today = new Date(2025, 7, 25).toISOString().split('T')[0]; // 25 de agosto de 2025
    return evento.fecha_inicio.split('T')[0] > today;
  }).slice(0, 5);

  const handleCreateEvent = async () => {
    if (!user) return;
    
    if (!newEvent.titulo || !newEvent.fecha || !newEvent.hora) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      const fechaInicio = new Date(`${newEvent.fecha}T${newEvent.hora}`);
      
      const { error } = await supabase
        .from('eventos_calendario')
        .insert({
          user_id: user.id,
          titulo: newEvent.titulo,
          descripcion: newEvent.descripcion,
          fecha_inicio: fechaInicio.toISOString(),
          tipo: newEvent.tipo,
          prioridad: newEvent.prioridad,
          recordatorios: newEvent.recordatorios,
        });

      if (error) throw error;

      toast({
        title: "Evento creado",
        description: "El evento se ha creado exitosamente",
      });

      setIsDialogOpen(false);
      setNewEvent({
        titulo: "",
        descripcion: "",
        fecha: "",
        hora: "",
        tipo: "evento",
        prioridad: "media",
        recordatorios: ["24h"],
      });
      
      loadEventos();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive",
      });
    }
  };

  const handleCompleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('eventos_calendario')
        .update({ estado: 'completado' })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Evento completado",
        description: "El evento se ha marcado como completado",
      });

      loadEventos();
    } catch (error) {
      console.error('Error completing event:', error);
      toast({
        title: "Error",
        description: "No se pudo completar el evento",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('eventos_calendario')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Evento eliminado",
        description: "El evento se ha eliminado exitosamente",
      });

      loadEventos();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el evento",
        variant: "destructive",
      });
    }
  };

  const generateICSLink = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Performan Hub//Calendar//EN
${eventos.map(evento => `
BEGIN:VEVENT
UID:${evento.id}@performan.app
DTSTART:${evento.fecha_inicio.replace(/[-:]/g, '').replace('T', '').split('.')[0]}Z
SUMMARY:${evento.titulo}
DESCRIPTION:${evento.descripcion || ''}
END:VEVENT`).join('')}
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const getPriorityColor = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baja': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'reunion': return <MapPin className="w-3 h-3" />;
      case 'tarea': return <CheckCircle className="w-3 h-3" />;
      default: return <CalendarIcon className="w-3 h-3" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
            <p className="text-muted-foreground">Cargando eventos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario</h1>
          <p className="text-muted-foreground">
            Gestiona tus tareas, reuniones y eventos. Hoy es {format(new Date(2025, 7, 25), "d 'de' MMMM 'de' yyyy", { locale: es })}.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.open(generateICSLink())}>
            <Download className="w-4 h-4 mr-2" />
            Exportar ICS
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nuevo Evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título *</Label>
                  <Input
                    id="titulo"
                    placeholder="Título del evento"
                    value={newEvent.titulo}
                    onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={newEvent.tipo} onValueChange={(value: any) => setNewEvent({ ...newEvent, tipo: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="evento">Evento</SelectItem>
                      <SelectItem value="tarea">Tarea</SelectItem>
                      <SelectItem value="reunion">Reunión</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newEvent.fecha && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEvent.fecha ? format(new Date(newEvent.fecha), "dd/MM/yyyy") : "Seleccionar fecha"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newEvent.fecha ? new Date(newEvent.fecha) : undefined}
                          onSelect={(date) => setNewEvent({ ...newEvent, fecha: date ? format(date, "yyyy-MM-dd") : "" })}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora *</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={newEvent.hora}
                      onChange={(e) => setNewEvent({ ...newEvent, hora: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select value={newEvent.prioridad} onValueChange={(value: any) => setNewEvent({ ...newEvent, prioridad: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    placeholder="Detalles del evento..."
                    value={newEvent.descripcion}
                    onChange={(e) => setNewEvent({ ...newEvent, descripcion: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    Crear Evento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList>
          <TabsTrigger value="mes">Vista Mes</TabsTrigger>
          <TabsTrigger value="semana">Vista Semana</TabsTrigger>
          <TabsTrigger value="lista">Lista</TabsTrigger>
        </TabsList>

        <TabsContent value="mes" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                {format(selectedDate, "MMMM yyyy", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full pointer-events-auto"
                locale={es}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Semana del {format(selectedDate, "d", { locale: es })} de {format(selectedDate, "MMMM yyyy", { locale: es })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Vista semanal - Próximamente disponible</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista" className="space-y-6">
          {/* Today's events */}
          {hoyEventos.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Hoy - {format(new Date(2025, 7, 25), "d 'de' MMMM", { locale: es })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hoyEventos.map((evento) => (
                  <div key={evento.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(evento.tipo)}
                        <h4 className="font-medium">{evento.titulo}</h4>
                        <Badge variant={getPriorityColor(evento.prioridad)} className="text-xs">
                          {evento.prioridad}
                        </Badge>
                        {evento.estado === 'completado' && (
                          <Badge variant="outline" className="text-xs text-green-600">
                            Completado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(evento.fecha_inicio), "HH:mm")}
                        </span>
                        <span className="capitalize">{evento.tipo}</span>
                      </div>
                      {evento.descripcion && (
                        <p className="text-sm text-muted-foreground mt-2">{evento.descripcion}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {evento.estado !== 'completado' && (
                        <Button variant="ghost" size="sm" onClick={() => handleCompleteEvent(evento.id)}>
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(evento.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upcoming events */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((evento) => (
                  <div key={evento.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getTypeIcon(evento.tipo)}
                        <h4 className="font-medium">{evento.titulo}</h4>
                        <Badge variant={getPriorityColor(evento.prioridad)} className="text-xs">
                          {evento.prioridad}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(evento.fecha_inicio), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(evento.fecha_inicio), "HH:mm")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">{evento.tipo}</Badge>
                        {evento.recordatorios.map((recordatorio, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            Recordatorio {recordatorio}
                          </Badge>
                        ))}
                      </div>
                      {evento.descripcion && (
                        <p className="text-sm text-muted-foreground mt-2">{evento.descripcion}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleCompleteEvent(evento.id)}>
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(evento.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No tienes eventos próximos</p>
                  <p className="text-sm">Crea tu primer evento con el botón "Nuevo Evento"</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}