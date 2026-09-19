-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'AUTORIZADO', 'CONFIRMADO', 'FALLIDO', 'CANCELADO', 'REEMBOLSADO_PARCIAL', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "EstadoReembolso" AS ENUM ('SOLICITADO', 'PROCESANDO', 'CONFIRMADO', 'FALLIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoFiscal" AS ENUM ('BORRADOR', 'PENDIENTE', 'EMITIDO', 'RECHAZADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "EstadoTurno" AS ENUM ('ABIERTO', 'EN_REVISION', 'CERRADO');

-- CreateEnum
CREATE TYPE "TipoMovimientoCaja" AS ENUM ('INGRESO', 'EGRESO');

-- CreateEnum
CREATE TYPE "EstadoLiquidacion" AS ENUM ('ABIERTA', 'EN_REVISION', 'APROBADA', 'RECHAZADA');

-- CreateTable
CREATE TABLE "pago" (
    "id_pago" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_cliente" INTEGER,
    "monto" DECIMAL(14,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "metodo" "MetodoPago" NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "autorizado_at" TIMESTAMPTZ(3),
    "confirmado_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pago_pkey" PRIMARY KEY ("id_pago")
);

-- CreateTable
CREATE TABLE "intento_pago" (
    "id_intento_pago" SERIAL NOT NULL,
    "proveedor" VARCHAR(60) NOT NULL,
    "referencia_externa" VARCHAR(150),
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "monto" DECIMAL(14,2) NOT NULL,
    "finalizado_at" TIMESTAMPTZ(3),
    "codigo_error" VARCHAR(100),
    "token_proveedor" TEXT,
    "id_pago" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "intento_pago_pkey" PRIMARY KEY ("id_intento_pago")
);

-- CreateTable
CREATE TABLE "evento_pasarela" (
    "id_evento_pasarela" SERIAL NOT NULL,
    "proveedor" VARCHAR(60) NOT NULL,
    "evento_externo" VARCHAR(150) NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "firma_verificada" BOOLEAN NOT NULL DEFAULT false,
    "resumen_sanitizado" JSONB NOT NULL,
    "procesado_at" TIMESTAMPTZ(3),
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "error_codigo" VARCHAR(100),
    "id_intento" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "evento_pasarela_pkey" PRIMARY KEY ("id_evento_pasarela")
);

-- CreateTable
CREATE TABLE "reembolso" (
    "id_reembolso" SERIAL NOT NULL,
    "id_devolucion" INTEGER,
    "monto" DECIMAL(14,2) NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoReembolso" NOT NULL DEFAULT 'SOLICITADO',
    "proveedor" VARCHAR(60),
    "referencia_proveedor" VARCHAR(150),
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "confirmado_at" TIMESTAMPTZ(3),
    "id_pago" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "reembolso_pkey" PRIMARY KEY ("id_reembolso")
);

-- CreateTable
CREATE TABLE "factura" (
    "id_factura" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "serie" VARCHAR(60),
    "numero" VARCHAR(60),
    "referencia_fiscal" VARCHAR(150),
    "proveedor_fiscal" VARCHAR(60),
    "estado" "EstadoFiscal" NOT NULL DEFAULT 'BORRADOR',
    "fecha_emision" TIMESTAMPTZ(3),
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "nombre_comprador" VARCHAR(200) NOT NULL,
    "identificacion_fiscal" VARCHAR(30),
    "direccion_comprador" TEXT,
    "correo_comprador" VARCHAR(254),
    "subtotal" DECIMAL(14,2) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "impuesto" DECIMAL(14,2) NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "archivo_privado" TEXT,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "factura_pkey" PRIMARY KEY ("id_factura")
);

-- CreateTable
CREATE TABLE "detalle_factura" (
    "id_detalle_factura" SERIAL NOT NULL,
    "id_detalle_pedido" INTEGER,
    "sku" VARCHAR(60),
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(16,6) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "base_imponible" DECIMAL(14,2) NOT NULL,
    "tasa_impuesto" DECIMAL(7,4) NOT NULL,
    "impuesto" DECIMAL(14,2) NOT NULL,
    "total" DECIMAL(14,2) NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_factura_pkey" PRIMARY KEY ("id_detalle_factura")
);

-- CreateTable
CREATE TABLE "documento_ajuste" (
    "id_documento_ajuste" SERIAL NOT NULL,
    "tipo" VARCHAR(40) NOT NULL,
    "motivo" TEXT NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "estado" "EstadoFiscal" NOT NULL DEFAULT 'BORRADOR',
    "referencia_externa" VARCHAR(150),
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "id_factura" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "documento_ajuste_pkey" PRIMARY KEY ("id_documento_ajuste")
);

-- CreateTable
CREATE TABLE "caja" (
    "id_caja" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "caja_pkey" PRIMARY KEY ("id_caja")
);

-- CreateTable
CREATE TABLE "turno_caja" (
    "id_turno_caja" SERIAL NOT NULL,
    "id_cajero" INTEGER NOT NULL,
    "estado" "EstadoTurno" NOT NULL DEFAULT 'ABIERTO',
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "abierto_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cerrado_at" TIMESTAMPTZ(3),
    "fondo_inicial" DECIMAL(14,2) NOT NULL,
    "monto_esperado" DECIMAL(14,2),
    "monto_contado" DECIMAL(14,2),
    "revisado_por" INTEGER,
    "id_caja" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "turno_caja_pkey" PRIMARY KEY ("id_turno_caja")
);

-- CreateTable
CREATE TABLE "movimiento_caja" (
    "id_movimiento_caja" SERIAL NOT NULL,
    "tipo" "TipoMovimientoCaja" NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "motivo" TEXT NOT NULL,
    "id_actor" INTEGER NOT NULL,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "id_turno" INTEGER NOT NULL,
    "id_pago" INTEGER,
    "id_reembolso" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_caja_pkey" PRIMARY KEY ("id_movimiento_caja")
);

-- CreateTable
CREATE TABLE "cobro_entrega" (
    "id_cobro_entrega" SERIAL NOT NULL,
    "id_envio" INTEGER NOT NULL,
    "id_repartidor" INTEGER NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "referencia" VARCHAR(100) NOT NULL,
    "id_pago" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cobro_entrega_pkey" PRIMARY KEY ("id_cobro_entrega")
);

-- CreateTable
CREATE TABLE "liquidacion_entrega" (
    "id_liquidacion_entrega" SERIAL NOT NULL,
    "id_repartidor" INTEGER NOT NULL,
    "id_cajero" INTEGER NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "periodo_desde" TIMESTAMPTZ(3) NOT NULL,
    "periodo_hasta" TIMESTAMPTZ(3) NOT NULL,
    "monto_esperado" DECIMAL(14,2) NOT NULL,
    "monto_entregado" DECIMAL(14,2) NOT NULL,
    "estado" "EstadoLiquidacion" NOT NULL DEFAULT 'ABIERTA',
    "cerrada_at" TIMESTAMPTZ(3),
    "observaciones" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "liquidacion_entrega_pkey" PRIMARY KEY ("id_liquidacion_entrega")
);

-- CreateTable
CREATE TABLE "detalle_liquidacion" (
    "id_detalle_liquidacion" SERIAL NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "id_liquidacion" INTEGER NOT NULL,
    "id_cobro" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_liquidacion_pkey" PRIMARY KEY ("id_detalle_liquidacion")
);

-- CreateTable
CREATE TABLE "auditoria_evento" (
    "id_auditoria_evento" SERIAL NOT NULL,
    "id_actor" INTEGER,
    "actor_sistema" VARCHAR(100),
    "accion" VARCHAR(100) NOT NULL,
    "entidad" VARCHAR(100) NOT NULL,
    "referencia" VARCHAR(100) NOT NULL,
    "resultado" VARCHAR(40) NOT NULL,
    "correlacion" VARCHAR(100) NOT NULL,
    "cambios_sanitizados" JSONB,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_evento_pkey" PRIMARY KEY ("id_auditoria_evento")
);

-- CreateTable
CREATE TABLE "outbox_evento" (
    "id_outbox_evento" SERIAL NOT NULL,
    "evento_id" UUID NOT NULL,
    "tipo" VARCHAR(100) NOT NULL,
    "agregado" VARCHAR(100) NOT NULL,
    "referencia" VARCHAR(100) NOT NULL,
    "version" INTEGER NOT NULL,
    "payload" JSONB NOT NULL,
    "publicado_at" TIMESTAMPTZ(3),
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "siguiente_intento" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "outbox_evento_pkey" PRIMARY KEY ("id_outbox_evento")
);

-- CreateTable
CREATE TABLE "inbox_evento" (
    "id_inbox_evento" SERIAL NOT NULL,
    "consumidor" VARCHAR(100) NOT NULL,
    "evento_id" UUID NOT NULL,
    "procesado_at" TIMESTAMPTZ(3),
    "resultado" VARCHAR(40),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "inbox_evento_pkey" PRIMARY KEY ("id_inbox_evento")
);

-- CreateTable
CREATE TABLE "operacion_idempotente" (
    "id_operacion_idempotente" SERIAL NOT NULL,
    "alcance" VARCHAR(100) NOT NULL,
    "clave" VARCHAR(150) NOT NULL,
    "hash_solicitud" VARCHAR(128) NOT NULL,
    "estado" VARCHAR(40) NOT NULL,
    "referencia_resultado" VARCHAR(100),
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "operacion_idempotente_pkey" PRIMARY KEY ("id_operacion_idempotente")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id_notificacion" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "evento" VARCHAR(100) NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "url_interna" TEXT,
    "canal" VARCHAR(30) NOT NULL,
    "leida_at" TIMESTAMPTZ(3),
    "clave_idempotencia" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id_notificacion")
);

-- CreateTable
CREATE TABLE "entrega_notificacion" (
    "id_entrega_notificacion" SERIAL NOT NULL,
    "proveedor" VARCHAR(60) NOT NULL,
    "referencia_proveedor" VARCHAR(150),
    "estado" VARCHAR(30) NOT NULL,
    "intento" INTEGER NOT NULL,
    "error_codigo" VARCHAR(100),
    "siguiente_intento" TIMESTAMPTZ(3),
    "id_notificacion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "entrega_notificacion_pkey" PRIMARY KEY ("id_entrega_notificacion")
);

-- CreateIndex
CREATE UNIQUE INDEX "pago_clave_idempotencia_key" ON "pago"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "pago_id_pedido_idx" ON "pago"("id_pedido");

-- CreateIndex
CREATE INDEX "pago_estado_created_at_idx" ON "pago"("estado", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "intento_pago_clave_idempotencia_key" ON "intento_pago"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "intento_pago_id_pago_idx" ON "intento_pago"("id_pago");

-- CreateIndex
CREATE UNIQUE INDEX "intento_pago_proveedor_referencia_externa_key" ON "intento_pago"("proveedor", "referencia_externa");

-- CreateIndex
CREATE INDEX "evento_pasarela_id_intento_idx" ON "evento_pasarela"("id_intento");

-- CreateIndex
CREATE UNIQUE INDEX "evento_pasarela_proveedor_evento_externo_key" ON "evento_pasarela"("proveedor", "evento_externo");

-- CreateIndex
CREATE UNIQUE INDEX "reembolso_clave_idempotencia_key" ON "reembolso"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "reembolso_id_pago_idx" ON "reembolso"("id_pago");

-- CreateIndex
CREATE UNIQUE INDEX "reembolso_proveedor_referencia_proveedor_key" ON "reembolso"("proveedor", "referencia_proveedor");

-- CreateIndex
CREATE UNIQUE INDEX "factura_referencia_fiscal_key" ON "factura"("referencia_fiscal");

-- CreateIndex
CREATE UNIQUE INDEX "factura_clave_idempotencia_key" ON "factura"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "factura_id_pedido_idx" ON "factura"("id_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "factura_serie_numero_key" ON "factura"("serie", "numero");

-- CreateIndex
CREATE INDEX "detalle_factura_id_factura_idx" ON "detalle_factura"("id_factura");

-- CreateIndex
CREATE UNIQUE INDEX "documento_ajuste_referencia_externa_key" ON "documento_ajuste"("referencia_externa");

-- CreateIndex
CREATE UNIQUE INDEX "documento_ajuste_clave_idempotencia_key" ON "documento_ajuste"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "documento_ajuste_id_factura_idx" ON "documento_ajuste"("id_factura");

-- CreateIndex
CREATE UNIQUE INDEX "caja_id_sucursal_codigo_key" ON "caja"("id_sucursal", "codigo");

-- CreateIndex
CREATE INDEX "turno_caja_id_cajero_estado_idx" ON "turno_caja"("id_cajero", "estado");

-- CreateIndex
CREATE INDEX "turno_caja_id_caja_idx" ON "turno_caja"("id_caja");

-- CreateIndex
CREATE UNIQUE INDEX "movimiento_caja_clave_idempotencia_key" ON "movimiento_caja"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "movimiento_caja_id_turno_idx" ON "movimiento_caja"("id_turno");

-- CreateIndex
CREATE INDEX "movimiento_caja_id_pago_idx" ON "movimiento_caja"("id_pago");

-- CreateIndex
CREATE INDEX "movimiento_caja_id_reembolso_idx" ON "movimiento_caja"("id_reembolso");

-- CreateIndex
CREATE UNIQUE INDEX "cobro_entrega_referencia_key" ON "cobro_entrega"("referencia");

-- CreateIndex
CREATE INDEX "cobro_entrega_id_pago_idx" ON "cobro_entrega"("id_pago");

-- CreateIndex
CREATE UNIQUE INDEX "cobro_entrega_id_pago_key" ON "cobro_entrega"("id_pago");

-- CreateIndex
CREATE INDEX "detalle_liquidacion_id_liquidacion_idx" ON "detalle_liquidacion"("id_liquidacion");

-- CreateIndex
CREATE INDEX "detalle_liquidacion_id_cobro_idx" ON "detalle_liquidacion"("id_cobro");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_liquidacion_id_cobro_key" ON "detalle_liquidacion"("id_cobro");

-- CreateIndex
CREATE INDEX "auditoria_evento_entidad_referencia_idx" ON "auditoria_evento"("entidad", "referencia");

-- CreateIndex
CREATE INDEX "auditoria_evento_created_at_idx" ON "auditoria_evento"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "outbox_evento_evento_id_key" ON "outbox_evento"("evento_id");

-- CreateIndex
CREATE INDEX "outbox_evento_publicado_at_siguiente_intento_idx" ON "outbox_evento"("publicado_at", "siguiente_intento");

-- CreateIndex
CREATE UNIQUE INDEX "inbox_evento_consumidor_evento_id_key" ON "inbox_evento"("consumidor", "evento_id");

-- CreateIndex
CREATE INDEX "operacion_idempotente_vence_at_idx" ON "operacion_idempotente"("vence_at");

-- CreateIndex
CREATE UNIQUE INDEX "operacion_idempotente_alcance_clave_key" ON "operacion_idempotente"("alcance", "clave");

-- CreateIndex
CREATE UNIQUE INDEX "notificacion_clave_idempotencia_key" ON "notificacion"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "notificacion_id_usuario_leida_at_created_at_idx" ON "notificacion"("id_usuario", "leida_at", "created_at");

-- CreateIndex
CREATE INDEX "entrega_notificacion_id_notificacion_idx" ON "entrega_notificacion"("id_notificacion");

-- CreateIndex
CREATE UNIQUE INDEX "entrega_notificacion_id_notificacion_intento_key" ON "entrega_notificacion"("id_notificacion", "intento");

-- AddForeignKey
ALTER TABLE "intento_pago" ADD CONSTRAINT "intento_pago_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_pasarela" ADD CONSTRAINT "evento_pasarela_id_intento_fkey" FOREIGN KEY ("id_intento") REFERENCES "intento_pago"("id_intento_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reembolso" ADD CONSTRAINT "reembolso_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_factura" ADD CONSTRAINT "detalle_factura_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "factura"("id_factura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_ajuste" ADD CONSTRAINT "documento_ajuste_id_factura_fkey" FOREIGN KEY ("id_factura") REFERENCES "factura"("id_factura") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "turno_caja" ADD CONSTRAINT "turno_caja_id_caja_fkey" FOREIGN KEY ("id_caja") REFERENCES "caja"("id_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_caja" ADD CONSTRAINT "movimiento_caja_id_turno_fkey" FOREIGN KEY ("id_turno") REFERENCES "turno_caja"("id_turno_caja") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_caja" ADD CONSTRAINT "movimiento_caja_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_caja" ADD CONSTRAINT "movimiento_caja_id_reembolso_fkey" FOREIGN KEY ("id_reembolso") REFERENCES "reembolso"("id_reembolso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cobro_entrega" ADD CONSTRAINT "cobro_entrega_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pago"("id_pago") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_liquidacion" ADD CONSTRAINT "detalle_liquidacion_id_liquidacion_fkey" FOREIGN KEY ("id_liquidacion") REFERENCES "liquidacion_entrega"("id_liquidacion_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_liquidacion" ADD CONSTRAINT "detalle_liquidacion_id_cobro_fkey" FOREIGN KEY ("id_cobro") REFERENCES "cobro_entrega"("id_cobro_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "entrega_notificacion_id_notificacion_fkey" FOREIGN KEY ("id_notificacion") REFERENCES "notificacion"("id_notificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- INVARIANTES V05
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
