import { useState, useEffect } from "react";
import { BarChart3, Download, TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AnalyticsData {
  area: string;
  formacionBasica: number;
  experiencia: number;
  autonomia: number;
  responsabilidadPorEquipo: number;
  iniciativa: number;
  totalPuestos: number;
}

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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Obtener evaluaciones manuales
      const { data: evaluaciones, error: evalError } = await supabase
        .from('evaluaciones_puesto')
        .select(`
          *,
          puestos (
            area,
            titulo
          )
        `);

      if (evalError) {
        console.error('Error al obtener evaluaciones:', evalError);
        throw evalError;
      }

      // Obtener valoraciones extraídas de documentos
      const { data: valoraciones, error: valorError } = await supabase
        .from('valoraciones_documentos')
        .select(`
          *,
          puestos (
            area,
            titulo
          )
        `);

      if (valorError) {
        console.error('Error al obtener valoraciones de documentos:', valorError);
        throw valorError;
      }

      console.log('Evaluaciones obtenidas:', evaluaciones?.length || 0);
      console.log('Valoraciones de documentos obtenidas:', valoraciones?.length || 0);

      // Combinar evaluaciones manuales y valoraciones de documentos
      const todasLasEvaluaciones = [
        ...(evaluaciones || []).map(e => ({ ...e, origen: 'manual' })),
        ...(valoraciones || []).map(v => ({ 
          ...v, 
          origen: 'documento',
          puestos: v.puestos
        }))
      ];

      if (todasLasEvaluaciones.length === 0) {
        console.log('No se encontraron evaluaciones ni valoraciones');
        setAnalyticsData([]);
        return;
      }

      // Agrupar por área y calcular promedios
      const dataByArea = todasLasEvaluaciones.reduce((acc, item) => {
        const area = item.puestos?.area || 'Sin área';
        
        if (!acc[area]) {
          acc[area] = {
            area,
            formacionBasica: [],
            experiencia: [],
            autonomia: [],
            responsabilidadPorEquipo: [],
            iniciativa: [],
            totalPuestos: new Set()
          };
        }

        acc[area].totalPuestos.add(item.puesto_id);

        // Mapear criterios a campos
        const criterio = item.criterio?.toLowerCase();
        const puntuacion = item.puntuacion || 0;
        
        if (criterio?.includes('formación') || criterio?.includes('formacion')) {
          acc[area].formacionBasica.push(puntuacion);
        } else if (criterio === 'experiencia') {
          acc[area].experiencia.push(puntuacion);
        } else if (criterio?.includes('autonomía') || criterio?.includes('autonomia')) {
          acc[area].autonomia.push(puntuacion);
        } else if (criterio?.includes('responsabilidad')) {
          acc[area].responsabilidadPorEquipo.push(puntuacion);
        } else if (criterio === 'iniciativa') {
          acc[area].iniciativa.push(puntuacion);
        }

        return acc;
      }, {} as Record<string, any>);

      // Calcular promedios
      const analyticsResult = Object.values(dataByArea).map((areaData: any) => ({
        area: areaData.area,
        formacionBasica: areaData.formacionBasica.length > 0 ? 
          Math.round((areaData.formacionBasica.reduce((a: number, b: number) => a + b, 0) / areaData.formacionBasica.length) * 10) / 10 : 0,
        experiencia: areaData.experiencia.length > 0 ? 
          Math.round((areaData.experiencia.reduce((a: number, b: number) => a + b, 0) / areaData.experiencia.length) * 10) / 10 : 0,
        autonomia: areaData.autonomia.length > 0 ? 
          Math.round((areaData.autonomia.reduce((a: number, b: number) => a + b, 0) / areaData.autonomia.length) * 10) / 10 : 0,
        responsabilidadPorEquipo: areaData.responsabilidadPorEquipo.length > 0 ? 
          Math.round((areaData.responsabilidadPorEquipo.reduce((a: number, b: number) => a + b, 0) / areaData.responsabilidadPorEquipo.length) * 10) / 10 : 0,
        iniciativa: areaData.iniciativa.length > 0 ? 
          Math.round((areaData.iniciativa.reduce((a: number, b: number) => a + b, 0) / areaData.iniciativa.length) * 10) / 10 : 0,
        totalPuestos: areaData.puestos.size
      }));

      console.log('Datos analíticos procesados:', analyticsResult);
      setAnalyticsData(analyticsResult);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = (data: any[], filename: string) => {
    // Mock CSV export functionality
    console.log(`Exportando ${filename}:`, data);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Cargando analíticas...</div>
      </div>
    );
  }

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
                    <SelectItem value="formacion">Formación básica</SelectItem>
                    <SelectItem value="experiencia">Experiencia</SelectItem>
                    <SelectItem value="autonomia">Autonomía</SelectItem>
                    <SelectItem value="responsabilidad">Responsabilidad por equipo</SelectItem>
                    <SelectItem value="iniciativa">Iniciativa</SelectItem>
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
              <Button variant="outline" size="sm" onClick={() => handleExportCSV(analyticsData, "medias-por-area")}>
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
                      <th className="text-center py-2">Formación Básica</th>
                      <th className="text-center py-2">Experiencia</th>
                      <th className="text-center py-2">Autonomía</th>
                      <th className="text-center py-2">Responsabilidad por Equipo</th>
                      <th className="text-center py-2">Iniciativa</th>
                      <th className="text-center py-2">Total Puestos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analyticsData.map((area, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 font-medium">{area.area}</td>
                        <td className="text-center">
                          <Badge variant="outline">{area.formacionBasica.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{area.experiencia.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{area.autonomia.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{area.responsabilidadPorEquipo.toFixed(1)}</Badge>
                        </td>
                        <td className="text-center">
                          <Badge variant="outline">{area.iniciativa.toFixed(1)}</Badge>
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
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Comparaciones por Versión</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Funcionalidad de comparación temporal próximamente disponible
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}