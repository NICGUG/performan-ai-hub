-- Insert missing positions based on storage structure

-- Recepción y manipulación area positions
INSERT INTO puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion)
VALUES 
('Coordinador/a Expediciones', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Coordinación de las expediciones y logística de envíos.'),
('Operador/a Planta de Chancado', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación y control de la planta de chancado de materiales.'),
('Operador/a Pala Cargadora', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de pala cargadora para manipulación de materiales.'),
('Conductor/a Camión', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Conducción de camiones para transporte de materiales.'),
('Operador/a Puente Grúa', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación del puente grúa para manipulación de cargas.'),
('Operador/a Planta Carga/Descarga Cisternas', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de la planta de carga y descarga de cisternas.'),
('Operador/a Planta de Ensacado', 'Recepcion y manipulacion', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación de la planta de ensacado de productos.');

-- RRHH area position
INSERT INTO puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion)
VALUES 
('Técnico/a Recursos Humanos', 'RRHH', 'Oficinas Administrativas', 'En revisión', 'Sistema', 'Documento subido', 'Soporte técnico en la gestión de recursos humanos.');

-- Additional position in Hornos area (based on the new document I saw)
INSERT INTO puestos (titulo, area, ubicacion, estado, propietario, ultima_accion, descripcion)
VALUES 
('Fundidor/a Flash-Eléctrico', 'Hornos', 'Planta Principal', 'En revisión', 'Sistema', 'Documento subido', 'Operación del horno flash-eléctrico en el área de fundición.');