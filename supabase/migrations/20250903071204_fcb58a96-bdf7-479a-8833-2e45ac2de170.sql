-- Vincular documentos específicos con sus puestos correspondientes

-- Fundidor Flash-Eléctrico
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Fundidor:a Flash-Electrico junio 2025.docx', 'Hornos/Descripcion Fundidor:a Flash-Electrico junio 2025.docx'
FROM puestos WHERE titulo = 'Fundidor/a Flash-Eléctrico' AND area = 'Hornos';

-- Coordinador Expediciones  
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Coordinador:a Expediciones Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Coordinador:a Expediciones Mayo 2025.docx'
FROM puestos WHERE titulo = 'Coordinador/a Expediciones' AND area = 'Recepcion y manipulacion';

-- Operador Planta Trituración
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Operador:a  Planta de Trituracion Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Operador:a  Planta de Trituracion Mayo 2025.docx'
FROM puestos WHERE titulo = 'Operador/a Planta de Trituración' AND area = 'Recepcion y manipulacion';

-- Operador Carga Silos
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Operador:a Carga de Silos Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Operador:a Carga de Silos Mayo 2025.docx'
FROM puestos WHERE titulo = 'Operador/a Carga de Silos' AND area = 'Recepcion y manipulacion';

-- Operador Báscula
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Operador:a de bascula Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Operador:a de bascula Mayo 2025.docx'
FROM puestos WHERE titulo = 'Operador/a de Báscula' AND area = 'Recepcion y manipulacion';

-- Operador Máquina R&M
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Operador:a Maquina Recepcion y Manipulacion Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Operador:a Maquina Recepcion y Manipulacion Mayo 2025.docx'
FROM puestos WHERE titulo = 'Operador/a Máquina Recepción y Manipulación' AND area = 'Recepcion y manipulacion';

-- Operador Secado y Clasificación
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Operador:a planta de secado y clasificacion silicato de hierro Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Operador:a planta de secado y clasificacion silicato de hierro Mayo 2025.docx'
FROM puestos WHERE titulo = 'Operador/a Planta de Secado y Clasificación Silicato de Hierro' AND area = 'Recepcion y manipulacion';

-- Operador Recepción Materiales
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Operador:a Recepcion de Materiales Mayo 2025.docx', 'Recepcion y manipulacion/Descripcion Operador:a Recepcion de Materiales Mayo 2025.docx'
FROM puestos WHERE titulo = 'Operador/a Recepción de Materiales' AND area = 'Recepcion y manipulacion';

-- Técnico Auxiliar Sanitario
INSERT INTO documentos_puesto (puesto_id, nombre_archivo, ruta_archivo)
SELECT id, 'Descripcion Tecnico_a Auxiliar Sanitario junio 2025 .docx', 'RRHH/Descripcion Tecnico_a Auxiliar Sanitario junio 2025 .docx'
FROM puestos WHERE titulo = 'Técnico/a Auxiliar Sanitario' AND area = 'RRHH';