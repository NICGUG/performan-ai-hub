import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, MapPin, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const mockEventos = [
  {
    id: "1",
    titulo: "Evaluación de puesto — Operador de Báscula",
    fecha: "2024-01-22",
    hora: "10:00",
    duracion: "2h",
    puesto: "Operador de Báscula",
    notas: "Revisión de competencias técnicas y evaluación de ajuste cultural",
    recordatorios: ["24h", "1h"],
  },
  {
    id: "2",
    titulo: "Evaluación de puesto — Técnico Aux. Gestión Ambiental",
    fecha: "2024-01-23",
    hora: "14:30",
    duracion: "1.5h",
    puesto: "Técnico Aux. Gestión Ambiental",
    notas: "Enfoque en normativas ambientales y herramientas de gestión",
    recordatorios: ["24h"],
  },
  {
    id: "3",
    titulo: "Evaluación de puesto — Supervisor de Operaciones",
    fecha: "2024-01-25",
    hora: "09:00",
    duracion: "3h",
    puesto: "Supervisor de Operaciones",
    notas: "Evaluación de liderazgo y gestión de equipos",
    recordatorios: ["24h", "1h"],
  },
];

const hoysEvents = mockEventos.filter(evento => {
  const today = new Date().toISOString().split('T')[0];
  return evento.fecha === today;
});

const upcomingEvents = mockEventos.filter(evento => {
  const today = new Date().toISOString().split('T')[0];
  return evento.fecha > today;
}).slice(0, 5);

export default function Calendario() {
  const [selectedView, setSelectedView] = useState("mes");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    titulo: "",
    fecha: "",
    hora: "",
    puesto: "",
    notas: "",
    recordatorios: ["24h"],
  });

  const generateICSLink = () => {
    // Mock ICS generation
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Performan Hub//Calendar//EN
${mockEventos.map(evento => `
BEGIN:VEVENT
UID:${evento.id}@performan.app
DTSTART:${evento.fecha.replace(/-/g, '')}T${evento.hora.replace(':', '')}00Z
SUMMARY:${evento.titulo}
DESCRIPTION:${evento.notas}
END:VEVENT`).join('')}
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    return url;
  };

  const handleCreateEvent = () => {
    console.log("Creando evento:", newEvent);
    setIsDialogOpen(false);
    setNewEvent({
      titulo: "",
      fecha: "",
      hora: "",
      puesto: "",
      notas: "",
      recordatorios: ["24h"],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendario de Evaluaciones</h1>
          <p className="text-muted-foreground">
            Programa y gestiona evaluaciones de puestos con recordatorios automáticos.
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
                Nueva Evaluación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Programar Evaluación de Puesto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    placeholder="Evaluación de puesto — [Nombre del puesto]"
                    value={newEvent.titulo}
                    onChange={(e) => setNewEvent({ ...newEvent, titulo: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={newEvent.fecha}
                      onChange={(e) => setNewEvent({ ...newEvent, fecha: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hora">Hora</Label>
                    <Input
                      id="hora"
                      type="time"
                      value={newEvent.hora}
                      onChange={(e) => setNewEvent({ ...newEvent, hora: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="puesto">Puesto Relacionado</Label>
                  <Select value={newEvent.puesto} onValueChange={(value) => setNewEvent({ ...newEvent, puesto: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona puesto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operador-bascula">Operador de Báscula</SelectItem>
                      <SelectItem value="tecnico-ambiental">Técnico Aux. Gestión Ambiental</SelectItem>
                      <SelectItem value="supervisor-operaciones">Supervisor de Operaciones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    placeholder="Detalles de la evaluación, competencias a revisar..."
                    value={newEvent.notas}
                    onChange={(e) => setNewEvent({ ...newEvent, notas: e.target.value })}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    Crear Evaluación
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
                Enero 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Vista de calendario mensual (zona horaria: Europe/Madrid)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semana" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Semana del 22-28 Enero 2024
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Vista de calendario semanal (zona horaria: Europe/Madrid)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lista" className="space-y-6">
          {/* Today's events */}
          {hoysEvents.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Hoy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hoysEvents.map((evento) => (
                  <div key={evento.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{evento.titulo}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {evento.hora} ({evento.duracion})
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {evento.puesto}
                        </span>
                      </div>
                      {evento.notas && (
                        <p className="text-sm text-muted-foreground mt-2">{evento.notas}</p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upcoming events */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Próximas Evaluaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((evento) => (
                <div key={evento.id} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{evento.titulo}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(evento.fecha).toLocaleDateString("es-ES", { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {evento.hora} ({evento.duracion})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{evento.puesto}</Badge>
                      {evento.recordatorios.map((recordatorio, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          Recordatorio {recordatorio}
                        </Badge>
                      ))}
                    </div>
                    {evento.notas && (
                      <p className="text-sm text-muted-foreground mt-2">{evento.notas}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}