-- Make the documentos bucket public for previews
UPDATE storage.buckets 
SET public = true 
WHERE id = 'documentos';