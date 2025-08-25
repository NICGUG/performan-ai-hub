-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Acceso completo a puestos" ON public.puestos;
DROP POLICY IF EXISTS "Acceso completo a evaluaciones_puesto" ON public.evaluaciones_puesto;
DROP POLICY IF EXISTS "Acceso completo a documentos_puesto" ON public.documentos_puesto;

-- Create secure policies for puestos table
CREATE POLICY "Authenticated users can view puestos" 
ON public.puestos 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create puestos" 
ON public.puestos 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update puestos" 
ON public.puestos 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete puestos" 
ON public.puestos 
FOR DELETE 
TO authenticated 
USING (true);

-- Create secure policies for evaluaciones_puesto table
CREATE POLICY "Authenticated users can view evaluaciones_puesto" 
ON public.evaluaciones_puesto 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create evaluaciones_puesto" 
ON public.evaluaciones_puesto 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update evaluaciones_puesto" 
ON public.evaluaciones_puesto 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete evaluaciones_puesto" 
ON public.evaluaciones_puesto 
FOR DELETE 
TO authenticated 
USING (true);

-- Create secure policies for documentos_puesto table
CREATE POLICY "Authenticated users can view documentos_puesto" 
ON public.documentos_puesto 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can create documentos_puesto" 
ON public.documentos_puesto 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update documentos_puesto" 
ON public.documentos_puesto 
FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete documentos_puesto" 
ON public.documentos_puesto 
FOR DELETE 
TO authenticated 
USING (true);