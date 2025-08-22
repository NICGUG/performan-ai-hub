-- Insert evaluation data for horno positions
INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Calidad Redacción',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 4
    WHEN 'Técnico de Mantenimiento Hornos' THEN 5
    WHEN 'Supervisor de Hornos' THEN 3
    WHEN 'Especialista Control Térmico' THEN 4
  END,
  'Evaluación automática de calidad'
FROM puestos p 
WHERE p.area = 'Hornos';

INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Ajuste Estilo',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 3
    WHEN 'Técnico de Mantenimiento Hornos' THEN 4
    WHEN 'Supervisor de Hornos' THEN 5
    WHEN 'Especialista Control Térmico' THEN 4
  END,
  'Evaluación de ajuste al estilo corporativo'
FROM puestos p 
WHERE p.area = 'Hornos';

INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Cobertura Competencias',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 4
    WHEN 'Técnico de Mantenimiento Hornos' THEN 4
    WHEN 'Supervisor de Hornos' THEN 4
    WHEN 'Especialista Control Térmico' THEN 5
  END,
  'Evaluación de cobertura de competencias'
FROM puestos p 
WHERE p.area = 'Hornos';