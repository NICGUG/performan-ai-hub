-- Crear los vínculos entre puestos y documentos existentes

-- Obtener IDs de los puestos recién creados y vincular con documentos
WITH nuevo_fundidor AS (
  SELECT id FROM puestos WHERE titulo = 'Fundidor/a Flash-Eléctrico' AND area = 'Hornos' LIMIT 1
),
nuevo_coordinador AS (
  SELECT id FROM puestos WHERE titulo = 'Coordinador/a Expediciones' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_trituracion AS (
  SELECT id FROM puestos WHERE titulo = 'Operador/a Planta de Trituración' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_silos AS (
  SELECT id FROM puestos WHERE titulo = 'Operador/a Carga de Silos' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_bascula AS (
  SELECT id FROM puestos WHERE titulo = 'Operador/a de Báscula' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_maquina AS (
  SELECT id FROM puestos WHERE titulo = 'Operador/a Máquina Recepción y Manipulación' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_secado AS (
  SELECT id FROM puestos WHERE titulo = 'Operador/a Planta de Secado y Clasificación Silicato de Hierro' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_recepcion AS (
  SELECT id FROM puestos WHERE titulo = 'Operador/a Recepción de Materiales' AND area = 'Recepcion y manipulacion' LIMIT 1
),
nuevo_sanitario AS (
  SELECT id FROM puestos WHERE titulo = 'Técnico/a Auxiliar Sanitario' AND area = 'RRHH' LIMIT 1
)

INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT * FROM (
  SELECT 
    (SELECT id FROM nuevo_fundidor),
    'Descripcion Fundidor:a Flash-Electrico junio 2025.docx',
    'Hornos/Descripcion Fundidor:a Flash-Electrico junio 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_coordinador),
    'Descripcion Coordinador:a Expediciones Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Coordinador:a Expediciones Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_trituracion),
    'Descripcion Operador:a  Planta de Trituracion Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Operador:a  Planta de Trituracion Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_silos),
    'Descripcion Operador:a Carga de Silos Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Operador:a Carga de Silos Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_bascula),
    'Descripcion Operador:a de bascula Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Operador:a de bascula Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_maquina),
    'Descripcion Operador:a Maquina Recepcion y Manipulacion Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Operador:a Maquina Recepcion y Manipulacion Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_secado),
    'Descripcion Operador:a planta de secado y clasificacion silicato de hierro Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Operador:a planta de secado y clasificacion silicato de hierro Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_recepcion),
    'Descripcion Operador:a Recepcion de Materiales Mayo 2025.docx',
    'Recepcion y manipulacion/Descripcion Operador:a Recepcion de Materiales Mayo 2025.docx'
  UNION ALL
  SELECT 
    (SELECT id FROM nuevo_sanitario),
    'Descripcion Tecnico_a Auxiliar Sanitario junio 2025 .docx',
    'RRHH/Descripcion Tecnico_a Auxiliar Sanitario junio 2025 .docx'
) AS documents
WHERE puesto_id IS NOT NULL;