import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Eye, Calendar, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const mockMessages = [
  {
    id: "1",
    remitente: "padre",
    mensaje: "¿Ya tienes lista la descripción del Operador de Báscula?",
    timestamp: "2024-01-15T09:30:00",
    leido: true,
  },
  {
    id: "2",
    remitente: "usuario",
    mensaje: "Sí, la IA ya terminó. Te comparto el enlace para que la revises:",
    timestamp: "2024-01-15T09:32:00",
    leido: true,
    adjuntos: [
      { tipo: "puesto", titulo: "Operador de Báscula", url: "/puestos/1" }
    ]
  },
  {
    id: "3",
    remitente: "padre",
    mensaje: "Perfecto. ¿Cuándo tienes programada la evaluación?",
    timestamp: "2024-01-15T09:35:00",
    leido: true,
  },
  {
    id: "4",
    remitente: "usuario",
    mensaje: "La tengo para mañana a las 10:00. Te adjunto el evento:",
    timestamp: "2024-01-15T09:37:00",
    leido: true,
    adjuntos: [
      { tipo: "evento", titulo: "Evaluación de puesto — Operador de Báscula", fecha: "2024-01-22 10:00", url: "/calendario" }
    ]
  },
  {
    id: "5",
    remitente: "padre",
    mensaje: "Excelente. Mantenme al tanto de los resultados.",
    timestamp: "2024-01-15T09:40:00",
    leido: false,
  },
];

export default function Chat() {
  const [mensajes, setMensajes] = useState(mockMessages);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const enviarMensaje = () => {
    if (!nuevoMensaje.trim()) return;

    const mensaje = {
      id: Date.now().toString(),
      remitente: "usuario" as const,
      mensaje: nuevoMensaje,
      timestamp: new Date().toISOString(),
      leido: true,
    };

    setMensajes([...mensajes, mensaje]);
    setNuevoMensaje("");

    // Simulate typing indicator and response
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      const respuesta = {
        id: (Date.now() + 1).toString(),
        remitente: "padre" as const,
        mensaje: "Entendido. Revisaré la información.",
        timestamp: new Date().toISOString(),
        leido: false,
      };
      setMensajes(prev => [...prev, respuesta]);
    }, 2000);
  };

  const marcarComoLeido = (id: string) => {
    setMensajes(prev => prev.map(msg => 
      msg.id === id ? { ...msg, leido: true } : msg
    ));
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("es-ES", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const getAvatarIcon = (remitente: string) => {
    return remitente === "usuario" ? "TU" : "P";
  };

  const getAdjuntoIcon = (tipo: string) => {
    switch (tipo) {
      case "puesto":
        return Eye;
      case "evento":
        return Calendar;
      default:
        return Paperclip;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Interno</h1>
          <p className="text-muted-foreground">
            Comunicación 1:1 para coordinación de puestos y evaluaciones.
          </p>
        </div>
      </div>

      <Card className="shadow-card h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Conversación con Coordinador
            <Badge variant="outline" className="ml-auto">En línea</Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {mensajes.map((mensaje) => (
              <div
                key={mensaje.id}
                className={`flex ${mensaje.remitente === "usuario" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex items-start gap-2 max-w-[70%] ${mensaje.remitente === "usuario" ? "flex-row-reverse" : "flex-row"}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs font-medium">
                      {getAvatarIcon(mensaje.remitente)}
                    </AvatarFallback>
                  </Avatar>

                  <div className={`space-y-1 ${mensaje.remitente === "usuario" ? "text-right" : "text-left"}`}>
                    <div
                      className={`p-3 rounded-lg ${
                        mensaje.remitente === "usuario"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{mensaje.mensaje}</p>
                    </div>

                    {mensaje.adjuntos && mensaje.adjuntos.length > 0 && (
                      <div className="space-y-2">
                        {mensaje.adjuntos.map((adjunto, index) => {
                          const IconComponent = getAdjuntoIcon(adjunto.tipo);
                          return (
                            <div
                              key={index}
                              className={`p-2 border rounded-lg text-xs ${
                                mensaje.remitente === "usuario" ? "border-primary/20" : "border-muted-foreground/20"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-3 h-3" />
                                <span className="font-medium">{adjunto.titulo}</span>
                              </div>
                              {adjunto.fecha && (
                                <p className="text-muted-foreground mt-1">{adjunto.fecha}</p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTime(mensaje.timestamp)}</span>
                      {mensaje.remitente === "usuario" && (
                        <span>{mensaje.leido ? "Leído" : "Enviado"}</span>
                      )}
                      {mensaje.remitente === "padre" && !mensaje.leido && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => marcarComoLeido(mensaje.id)}
                        >
                          Marcar como leído
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {escribiendo && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs font-medium">P</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Escribe un mensaje..."
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    enviarMensaje();
                  }
                }}
                className="flex-1"
              />
              <Button onClick={enviarMensaje} disabled={!nuevoMensaje.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}