-- Eliminar puestos del área de Operaciones
DELETE FROM documentos_puesto WHERE puesto_id IN (
  SELECT id FROM puestos WHERE area = 'Operaciones'
);

DELETE FROM puestos WHERE area = 'Operaciones';