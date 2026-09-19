-- Complemento de la migración INICIAL generada por Prisma para inventario.
-- No ejecutar solo: las tablas deben crearse antes en esa misma migración.
-- Prisma no representa estos CHECK/índices funcionales/parciales en schema.prisma.

ALTER TABLE "sucursal" ADD CONSTRAINT "ck_sucursal_1" CHECK (latitud IS NULL OR latitud BETWEEN -90 AND 90);
ALTER TABLE "sucursal" ADD CONSTRAINT "ck_sucursal_2" CHECK (longitud IS NULL OR longitud BETWEEN -180 AND 180);
ALTER TABLE "horario_sucursal" ADD CONSTRAINT "ck_horario_sucursal_1" CHECK (dia_semana BETWEEN 1 AND 7);
ALTER TABLE "horario_sucursal" ADD CONSTRAINT "ck_horario_sucursal_2" CHECK (apertura_minuto BETWEEN 0 AND 1439);
ALTER TABLE "horario_sucursal" ADD CONSTRAINT "ck_horario_sucursal_3" CHECK (cierre_minuto BETWEEN 0 AND 1439);
ALTER TABLE "horario_sucursal" ADD CONSTRAINT "ck_horario_sucursal_4" CHECK (cierra_dia_siguiente OR cierre_minuto > apertura_minuto);
ALTER TABLE "intervalo_excepcion" ADD CONSTRAINT "ck_intervalo_excepcion_1" CHECK (apertura_minuto BETWEEN 0 AND 1439);
ALTER TABLE "intervalo_excepcion" ADD CONSTRAINT "ck_intervalo_excepcion_2" CHECK (cierre_minuto BETWEEN 0 AND 1439);
ALTER TABLE "intervalo_excepcion" ADD CONSTRAINT "ck_intervalo_excepcion_3" CHECK (cierra_dia_siguiente OR cierre_minuto > apertura_minuto);
ALTER TABLE "lote" ADD CONSTRAINT "ck_lote_1" CHECK (fecha_vencimiento IS NULL OR fecha_fabricacion IS NULL OR fecha_vencimiento >= fecha_fabricacion);
ALTER TABLE "existencia" ADD CONSTRAINT "ck_existencia_1" CHECK (cantidad_fisica >= 0);
ALTER TABLE "existencia" ADD CONSTRAINT "ck_existencia_2" CHECK (cantidad_reservada BETWEEN 0 AND cantidad_fisica);
ALTER TABLE "existencia" ADD CONSTRAINT "ck_existencia_3" CHECK (minimo >= 0);
ALTER TABLE "existencia" ADD CONSTRAINT "ck_existencia_4" CHECK (maximo IS NULL OR maximo >= minimo);
ALTER TABLE "movimiento_inventario" ADD CONSTRAINT "ck_movimiento_inventario_1" CHECK (delta <> 0);
ALTER TABLE "movimiento_inventario" ADD CONSTRAINT "ck_movimiento_inventario_2" CHECK (saldo_resultante >= 0);
ALTER TABLE "reserva_detalle" ADD CONSTRAINT "ck_reserva_detalle_1" CHECK (cantidad > 0);
ALTER TABLE "apertura_empaque" ADD CONSTRAINT "ck_apertura_empaque_1" CHECK (id_origen <> id_destino);
ALTER TABLE "apertura_empaque" ADD CONSTRAINT "ck_apertura_empaque_2" CHECK (cantidad_origen > 0);
ALTER TABLE "apertura_empaque" ADD CONSTRAINT "ck_apertura_empaque_3" CHECK (factor_destino > 0);
ALTER TABLE "apertura_empaque" ADD CONSTRAINT "ck_apertura_empaque_4" CHECK (cantidad_destino::bigint = cantidad_origen::bigint * factor_destino::bigint);
ALTER TABLE "proveedor_presentacion" ADD CONSTRAINT "ck_proveedor_presentacion_1" CHECK (costo_referencia IS NULL OR costo_referencia >= 0);
ALTER TABLE "proveedor_presentacion" ADD CONSTRAINT "ck_proveedor_presentacion_2" CHECK (plazo_dias IS NULL OR plazo_dias >= 0);
ALTER TABLE "compra" ADD CONSTRAINT "ck_compra_1" CHECK (subtotal >= 0);
ALTER TABLE "compra" ADD CONSTRAINT "ck_compra_2" CHECK (descuento BETWEEN 0 AND subtotal);
ALTER TABLE "compra" ADD CONSTRAINT "ck_compra_3" CHECK (impuesto >= 0);
ALTER TABLE "compra" ADD CONSTRAINT "ck_compra_4" CHECK (total = subtotal - descuento + impuesto);
ALTER TABLE "detalle_compra" ADD CONSTRAINT "ck_detalle_compra_1" CHECK (cantidad > 0);
ALTER TABLE "detalle_compra" ADD CONSTRAINT "ck_detalle_compra_2" CHECK (costo_unitario >= 0);
ALTER TABLE "detalle_compra" ADD CONSTRAINT "ck_detalle_compra_3" CHECK (descuento BETWEEN 0 AND cantidad * costo_unitario);
ALTER TABLE "detalle_compra" ADD CONSTRAINT "ck_detalle_compra_4" CHECK (impuesto >= 0);
ALTER TABLE "detalle_recepcion" ADD CONSTRAINT "ck_detalle_recepcion_1" CHECK (cantidad > 0);
ALTER TABLE "traslado" ADD CONSTRAINT "ck_traslado_1" CHECK (id_origen <> id_destino);
ALTER TABLE "detalle_traslado" ADD CONSTRAINT "ck_detalle_traslado_1" CHECK (cantidad_enviada > 0);
ALTER TABLE "detalle_traslado" ADD CONSTRAINT "ck_detalle_traslado_2" CHECK (cantidad_recibida BETWEEN 0 AND cantidad_enviada);
ALTER TABLE "recepcion_traslado" ADD CONSTRAINT "ck_recepcion_traslado_1" CHECK (cantidad > 0);
ALTER TABLE "detalle_conteo" ADD CONSTRAINT "ck_detalle_conteo_1" CHECK (cantidad_sistema >= 0);
ALTER TABLE "detalle_conteo" ADD CONSTRAINT "ck_detalle_conteo_2" CHECK (cantidad_contada >= 0);
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "ck_entrega_notificacion_1" CHECK (intento > 0);
