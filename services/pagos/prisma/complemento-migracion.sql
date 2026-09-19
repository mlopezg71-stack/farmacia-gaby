-- Complemento de la migración INICIAL generada por Prisma para pagos.
-- No ejecutar solo: las tablas deben crearse antes en esa misma migración.
-- Prisma no representa estos CHECK/índices funcionales/parciales en schema.prisma.

ALTER TABLE "pago" ADD CONSTRAINT "ck_pago_1" CHECK (monto > 0);
ALTER TABLE "intento_pago" ADD CONSTRAINT "ck_intento_pago_1" CHECK (monto > 0);
ALTER TABLE "reembolso" ADD CONSTRAINT "ck_reembolso_1" CHECK (monto > 0);
ALTER TABLE "factura" ADD CONSTRAINT "ck_factura_1" CHECK (subtotal >= 0);
ALTER TABLE "factura" ADD CONSTRAINT "ck_factura_2" CHECK (descuento BETWEEN 0 AND subtotal);
ALTER TABLE "factura" ADD CONSTRAINT "ck_factura_3" CHECK (impuesto >= 0);
ALTER TABLE "factura" ADD CONSTRAINT "ck_factura_4" CHECK (total = subtotal - descuento + impuesto);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_1" CHECK (cantidad > 0);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_2" CHECK (precio_unitario >= 0);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_3" CHECK (descuento >= 0);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_4" CHECK (base_imponible >= 0);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_5" CHECK (tasa_impuesto BETWEEN 0 AND 1);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_6" CHECK (impuesto >= 0);
ALTER TABLE "detalle_factura" ADD CONSTRAINT "ck_detalle_factura_7" CHECK (total = base_imponible + impuesto);
ALTER TABLE "documento_ajuste" ADD CONSTRAINT "ck_documento_ajuste_1" CHECK (monto > 0);
ALTER TABLE "turno_caja" ADD CONSTRAINT "ck_turno_caja_1" CHECK (fondo_inicial >= 0);
ALTER TABLE "turno_caja" ADD CONSTRAINT "ck_turno_caja_2" CHECK (monto_esperado IS NULL OR monto_esperado >= 0);
ALTER TABLE "turno_caja" ADD CONSTRAINT "ck_turno_caja_3" CHECK (monto_contado IS NULL OR monto_contado >= 0);
ALTER TABLE "movimiento_caja" ADD CONSTRAINT "ck_movimiento_caja_1" CHECK (monto > 0);
ALTER TABLE "cobro_entrega" ADD CONSTRAINT "ck_cobro_entrega_1" CHECK (monto > 0);
ALTER TABLE "liquidacion_entrega" ADD CONSTRAINT "ck_liquidacion_entrega_1" CHECK (periodo_hasta >= periodo_desde);
ALTER TABLE "liquidacion_entrega" ADD CONSTRAINT "ck_liquidacion_entrega_2" CHECK (monto_esperado >= 0);
ALTER TABLE "liquidacion_entrega" ADD CONSTRAINT "ck_liquidacion_entrega_3" CHECK (monto_entregado >= 0);
ALTER TABLE "detalle_liquidacion" ADD CONSTRAINT "ck_detalle_liquidacion_1" CHECK (monto > 0);
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "ck_entrega_notificacion_1" CHECK (intento > 0);
CREATE UNIQUE INDEX "uq_turno_caja_abierto" ON "turno_caja" (id_caja) WHERE estado IN ('ABIERTO', 'EN_REVISION');
