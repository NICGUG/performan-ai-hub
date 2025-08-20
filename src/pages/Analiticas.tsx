import { useState } from "react";
import { BarChart3, Download, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const mockDataPorArea = [
  {
    area: "Operaciones",
    calidadRedaccion: 4.2,
    ajusteEstilo: 4.5,
    coberturaCompetencias: 3.8,
    totalPuestos: 12,
  },
  {
    area: "Medio Ambiente",
    calidadRedaccion: 4.6,
    ajusteEstilo: 4.3,
    coberturaCompetencias: 4.1,
    totalPuestos: 8,
  },
  {
    area: "Energía",
    calidadRedaccion: 4.1,
    ajusteEstilo: 4.7,
    coberturaCompetencias: 4.2,
    totalPuestos: 15,
  },
  {
    area: "Seguros",
    calidadRedaccion: 3.9,
    ajusteEstilo: 4.1,
    coberturaCompetencias: 3.7,
    totalPuestos: 6,
  },
];

const mockComparacionesPuestos = [
  {
    puesto: "Operador de Báscula",
    area: "Operaciones",
    deltaCalidad: 0.8,
    deltaEstilo: 0.3,
    deltaCompetencias: -0.2,
    fechaActual: "2024-01-15",
    fechaAnterior: "2023-11-20",
  },
  {
    puesto: "Técnico Aux. Gestión Ambiental",
    area: "Medio Ambiente",
    deltaCalidad: 1.2,
    deltaEstilo: 0.7,
    deltaCompetencias: 0.9,
    fechaActual: "2024-01-14",
    fechaAnterior: "2023-10-15",
  },
  {
    puesto: "Supervisor de Operaciones",
    area: "Operaciones",
    deltaCalidad: -0.3,
    deltaEstilo: 0.1,
    deltaCompetencias: 0.4,
    fechaActual: "2024-01-12",
    fechaAnterior: "2023-12-01",
  },
  {
    puesto: "Especialista en Energías Renovables",
    area: "Energía",
    deltaCalidad: 0.6,
    deltaEstilo: 0.9,
    deltaCompetencias: 0.5,
    fechaActual: "2024-01-10",
    fechaAnterior: "2023-09-25",
  },
];

const getDeltaColor = (delta: number) => {
  if (delta > 0.5) return "text-success";
  if (delta > 0) return "text-warning";
  if (delta < -0.5) return "text-destructive";
  return "text-muted-foreground";
};

const getDeltaIcon = (delta: number) => {
  return delta > 0 ? ArrowUp : ArrowDown;
};

const formatDelta = (delta: number) => {
  const percentage = (delta * 100 / 5).toFixed(1);
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)} (${percentage}%)`;
};

export default function Analiticas() {
  const [selectedArea, setSelectedArea] = useState("todas");
  const [selectedDimension, setSelectedDimension] = useState("todas");

  const handleExportCSV = (data: any[], filename: string) => {
    // Mock CSV export functionality
    console.log(`Exportando ${filename}:`, data);
  };

  const topMejoras = mockComparacionesPuestos
    .sort((a, b) => (b.deltaCalidad + b.deltaEstilo + b.deltaCompetencias) - (a.deltaCalidad + a.deltaEstilo + a.deltaCompetencias))
    .slice(0, 3);

  const topCaidas = mockComparacionesPuestos
    .sort((a, b) => (a.deltaCalidad + a.deltaEstilo + a.deltaCompetencias) - (b.deltaCalidad + b.deltaEstilo + b.deltaCompetencias))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analíticas de Descripciones</h1>
          <p className="text-muted-foreground">
            Análisis de valoraciones y comparativas de calidad de las descripciones generadas.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="space-y-2">
                <Label>Área</Label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las áreas</SelectItem>
                    <SelectItem value="operaciones">Operaciones</SelectItem>
                    <SelectItem value="medio-ambiente">Medio Ambiente</SelectItem>
                    <SelectItem value="energia">Energía</SelectItem>
                    <SelectItem value="seguros">Seguros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dimensión</Label>
                <Select value={selectedDimension} onValueChange={setSelectedDimension}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las dimensiones</SelectItem>
                    <SelectItem value="calidad">Calidad de redacción</SelectItem>
                    <SelectItem value="estilo">Ajuste al estilo</SelectItem>
                    <SelectItem value="competencias">Cobertura competencias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Periodo</Label>
                <Select defaultValue="ultimo-mes">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ultima-semana">Última semana</SelectItem>
                    <SelectItem value="ultimo-mes">Último mes</SelectItem>
                    <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="por-area">
        <TabsList>
          <TabsTrigger value="por-area">Comparación por Área</TabsTrigger>
          <TabsTrigger value="vs-pasado">vs. Versión Anterior</TabsTrigger>
        </TabsList>

        <TabsContent value="por-area" className="space-y-6">
          {/* Chart placeholder */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Medias por Área y Dimensión
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV(mockDataPorArea, "medias-por-area")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg flex items-center justify-center mb-6">
                <p className="text-muted-foreground">Gráfico de barras por área y dimensión</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Área</th>
                      <th className="text-center py-2">Calidad Redacción</th>
                      <th className="text-center py-2">Ajuste Estilo</th>
                      <th className="text-center py-2">Cobertura Competencias</th>
                      <th className="text-center py-2">Total Puestos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockDataPorArea.map((area, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{area.area}</td>
                        <td className="text-center">
                          <Badge variant="outline">{area.calidadRedaccion.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{area.ajusteEstilo.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{area.coberturaCompetencias.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center text-muted-foreground">{area.totalPuestos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vs-pasado" className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-success" />
                  Mayores Mejoras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topMejoras.map((puesto, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{puesto.puesto}</span>
                      <span className="text-success">+{((puesto.deltaCalidad + puesto.deltaEstilo + puesto.deltaCompetencias) / 3).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                  Mayores Caídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {topCaidas.map((puesto, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{puesto.puesto}</span>
                      <span className="text-destructive">{((puesto.deltaCalidad + puesto.deltaEstilo + puesto.deltaCompetencias) / 3).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed comparison table */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Comparación vs. Versión Anterior</CardTitle>
              <Button variant="outline" size="sm" onClick={() => handleExportCSV(mockComparacionesPuestos, "comparacion-versiones")}>
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Puesto</th>
                      <th className="text-left py-2">Área</th>
                      <th className="text-center py-2">Δ Calidad</th>
                      <th className="text-center py-2">Δ Estilo</th>
                      <th className="text-center py-2">Δ Competencias</th>
                      <th className="text-center py-2">Versiones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockComparacionesPuestos.map((puesto, index) => {
                      const DeltaCalidadIcon = getDeltaIcon(puesto.deltaCalidad);
                      const DeltaEstiloIcon = getDeltaIcon(puesto.deltaEstilo);
                      const DeltaCompetenciasIcon = getDeltaIcon(puesto.deltaCompetencias);

                      return (
                        <tr key={index} className="border-b">
                          <td className="py-3 font-medium">{puesto.puesto}</td>
                          <td className="py-3 text-muted-foreground">{puesto.area}</td>
                          <td className="text-center">
                            <div className={`flex items-center justify-center gap-1 ${getDeltaColor(puesto.deltaCalidad)}`}>
                              <DeltaCalidadIcon className="w-3 h-3" />
                              <span className="text-xs">{formatDelta(puesto.deltaCalidad)}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className={`flex items-center justify-center gap-1 ${getDeltaColor(puesto.deltaEstilo)}`}>
                              <DeltaEstiloIcon className="w-3 h-3" />
                              <span className="text-xs">{formatDelta(puesto.deltaEstilo)}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className={`flex items-center justify-center gap-1 ${getDeltaColor(puesto.deltaCompetencias)}`}>
                              <DeltaCompetenciasIcon className="w-3 h-3" />
                              <span className="text-xs">{formatDelta(puesto.deltaCompetencias)}</span>
                            </div>
                          </td>
                          <td className="text-center text-xs text-muted-foreground">
                            {new Date(puesto.fechaActual).toLocaleDateString()} vs {new Date(puesto.fechaAnterior).toLocaleDateString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}