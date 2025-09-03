-- Primero, eliminar los puestos incorrectos que creé
DELETE FROM puestos WHERE created_at > '2025-09-01 11:00:00';

-- Crear los puestos correctos basados en los documentos reales

-- HORNOS (5 puestos)
INSERT INTO puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion) VALUES
('Fundidor/a Flash-Eléctrico', 'Hornos', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación del horno flash-eléctrico en el área de fundición.');

-- RECEPCIÓN Y MANIPULACIÓN (7 puestos)
INSERT INTO puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion) VALUES
('Coordinador/a Expediciones', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Coordinación de las expediciones y logística de envíos.'),
('Operador/a Planta de Trituración', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación y control de la planta de trituración de materiales.'),
('Operador/a Carga de Silos', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de la carga de silos de materiales.'),
('Operador/a de Báscula', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación y control de la báscula de recepción.'),
('Operador/a Máquina Recepción y Manipulación', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de maquinaria de recepción y manipulación de materiales.'),
('Operador/a Planta de Secado y Clasificación Silicato de Hierro', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de la planta de secado y clasificación de silicato de hierro.'),
('Operador/a Recepción de Materiales', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de la recepción de materiales diversos.');

-- RRHH (1 puesto)
INSERT INTO puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion) VALUES
('Técnico/a Auxiliar Sanitario', 'RRHH', 'Oficinas Administrativas', 'En revisión', 'Sistema', 'Documento subido', 'Técnico auxiliar en servicios sanitarios y de salud laboral.');