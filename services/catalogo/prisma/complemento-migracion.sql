-- Complemento de la migración INICIAL generada por Prisma para catalogo.
-- No ejecutar solo: las tablas deben crearse antes en esa misma migración.
-- Prisma no representa estos CHECK/índices funcionales/parciales en schema.prisma.

ALTER TABLE "presentacion_producto" ADD CONSTRAINT "ck_presentacion_producto_1" CHECK (unidades_base > 0);
ALTER TABLE "presentacion_producto" ADD CONSTRAINT "ck_presentacion_producto_2" CHECK (contenido IS NULL OR contenido > 0);
ALTER TABLE "presentacion_producto" ADD CONSTRAINT "ck_presentacion_producto_3" CHECK (peso_gramos IS NULL OR peso_gramos > 0);
ALTER TABLE "conversion_presentacion" ADD CONSTRAINT "ck_conversion_presentacion_1" CHECK (id_origen <> id_destino);
ALTER TABLE "conversion_presentacion" ADD CONSTRAINT "ck_conversion_presentacion_2" CHECK (cantidad_destino > 0);
ALTER TABLE "conversion_presentacion" ADD CONSTRAINT "ck_conversion_presentacion_3" CHECK (version > 0);
ALTER TABLE "producto_componente" ADD CONSTRAINT "ck_producto_componente_1" CHECK (cantidad IS NULL OR cantidad > 0);
ALTER TABLE "producto_componente" ADD CONSTRAINT "ck_producto_componente_2" CHECK (denominador IS NULL OR denominador > 0);
ALTER TABLE "categoria" ADD CONSTRAINT "ck_categoria_1" CHECK (id_padre IS NULL OR id_padre <> id_categoria);
ALTER TABLE "producto_imagen" ADD CONSTRAINT "ck_producto_imagen_1" CHECK (ancho IS NULL OR ancho > 0);
ALTER TABLE "producto_imagen" ADD CONSTRAINT "ck_producto_imagen_2" CHECK (alto IS NULL OR alto > 0);
ALTER TABLE "producto_relacionado" ADD CONSTRAINT "ck_producto_relacionado_1" CHECK (id_origen <> id_destino);
ALTER TABLE "precio_presentacion" ADD CONSTRAINT "ck_precio_presentacion_1" CHECK (importe >= 0);
ALTER TABLE "precio_presentacion" ADD CONSTRAINT "ck_precio_presentacion_2" CHECK (tasa_impuesto BETWEEN 0 AND 1);
ALTER TABLE "precio_presentacion" ADD CONSTRAINT "ck_precio_presentacion_3" CHECK (hasta IS NULL OR hasta > desde);
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_1" CHECK (hasta > desde);
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_2" CHECK (valor IS NULL OR valor >= 0);
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_3" CHECK (tipo <> 'PORCENTAJE' OR (valor IS NOT NULL AND valor <= 100));
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_4" CHECK (minimo_compra >= 0);
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_5" CHECK (tope_descuento IS NULL OR tope_descuento >= 0);
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_6" CHECK (limite_global IS NULL OR limite_global > 0);
ALTER TABLE "promocion" ADD CONSTRAINT "ck_promocion_7" CHECK (limite_cliente IS NULL OR limite_cliente > 0);
ALTER TABLE "promocion_combo_detalle" ADD CONSTRAINT "ck_promocion_combo_detalle_1" CHECK (cantidad > 0);
ALTER TABLE "cupon" ADD CONSTRAINT "ck_cupon_1" CHECK (hasta > desde);
ALTER TABLE "cupon" ADD CONSTRAINT "ck_cupon_2" CHECK (limite_usos IS NULL OR limite_usos > 0);
ALTER TABLE "uso_promocion" ADD CONSTRAINT "ck_uso_promocion_1" CHECK (monto >= 0);
ALTER TABLE "convenio_seguro_publico" ADD CONSTRAINT "ck_convenio_seguro_publico_1" CHECK (hasta IS NULL OR desde IS NULL OR hasta >= desde);
ALTER TABLE "version_pagina" ADD CONSTRAINT "ck_version_pagina_1" CHECK (numero > 0);
ALTER TABLE "banner" ADD CONSTRAINT "ck_banner_1" CHECK (hasta IS NULL OR desde IS NULL OR hasta > desde);
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "ck_entrega_notificacion_1" CHECK (intento > 0);
CREATE UNIQUE INDEX "uq_categoria_principal" ON "producto_categoria" (id_producto) WHERE principal;
CREATE UNIQUE INDEX "uq_imagen_principal_producto" ON "producto_imagen" (id_producto) WHERE principal AND id_presentacion IS NULL;
CREATE UNIQUE INDEX "uq_imagen_principal_presentacion" ON "producto_imagen" (id_presentacion) WHERE principal AND id_presentacion IS NOT NULL;
CREATE UNIQUE INDEX "uq_cupon_normalizado" ON "cupon" (upper(btrim(codigo)));
CREATE INDEX "ix_producto_busqueda" ON "producto" USING GIN (to_tsvector('spanish', coalesce(nombre, '') || ' ' || coalesce(descripcion_corta, '')));
