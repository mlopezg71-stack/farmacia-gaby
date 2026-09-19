-- Complemento de la migración INICIAL generada por Prisma para auth.
-- No ejecutar solo: las tablas deben crearse antes en esa misma migración.
-- Prisma no representa estos CHECK/índices funcionales/parciales en schema.prisma.

ALTER TABLE "usuario" ADD CONSTRAINT "ck_usuario_1" CHECK (version_seguridad > 0);
ALTER TABLE "empleado" ADD CONSTRAINT "ck_empleado_1" CHECK (fecha_baja IS NULL OR fecha_baja >= fecha_contratacion);
ALTER TABLE "empleado_sucursal" ADD CONSTRAINT "ck_empleado_sucursal_1" CHECK (hasta IS NULL OR hasta >= desde);
ALTER TABLE "direccion_cliente" ADD CONSTRAINT "ck_direccion_cliente_1" CHECK (latitud IS NULL OR latitud BETWEEN -90 AND 90);
ALTER TABLE "direccion_cliente" ADD CONSTRAINT "ck_direccion_cliente_2" CHECK (longitud IS NULL OR longitud BETWEEN -180 AND 180);
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "ck_entrega_notificacion_1" CHECK (intento > 0);
CREATE UNIQUE INDEX "uq_usuario_correo_normalizado" ON "usuario" (lower(btrim(correo)));
CREATE UNIQUE INDEX "uq_direccion_predeterminada" ON "direccion_cliente" (id_cliente) WHERE predeterminada AND estado = 'ACTIVO';
CREATE UNIQUE INDEX "uq_empleado_sucursal_principal" ON "empleado_sucursal" (id_empleado) WHERE principal AND hasta IS NULL;
