-- Update evaluations to include proper job evaluation factors
DELETE FROM evaluaciones_puesto;

-- Insert proper evaluation criteria for horno positions
INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Formación básica',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 2
    WHEN 'Técnico de Mantenimiento Hornos' THEN 3
    WHEN 'Supervisor de Hornos' THEN 4
    WHEN 'Especialista Control Térmico' THEN 4
  END,
  'Evaluación de formación básica requerida'
FROM puestos p 
WHERE p.area = 'Hornos';

INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Experiencia',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 2
    WHEN 'Técnico de Mantenimiento Hornos' THEN 4
    WHEN 'Supervisor de Hornos' THEN 5
    WHEN 'Especialista Control Térmico' THEN 4
  END,
  'Evaluación de experiencia requerida'
FROM puestos p 
WHERE p.area = 'Hornos';

INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Autonomía',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 2
    WHEN 'Técnico de Mantenimiento Hornos' THEN 3
    WHEN 'Supervisor de Hornos' THEN 5
    WHEN 'Especialista Control Térmico' THEN 4
  END,
  'Evaluación de nivel de autonomía'
FROM puestos p 
WHERE p.area = 'Hornos';

INSERT INTO evaluaciones_puesto (puesto_id, criterio, puntuacion, comentarios) 
SELECT 
  p.id,
  'Responsabilidad por equipo',
  CASE p.titulo
    WHEN 'Operador de Hornos Túnel' THEN 1
    WHEN 'Técnico de Mantenimiento Hornos' THEN 2
    WHEN 'Supervisor de Hornos' THEN 5
    WHEN 'Especialista Control Térmico' THEN 3
  END,
  'Evaluación de responsabilidad por gestión de equipo'
FROM puestos p 
WHERE p.area = 'Hornos';