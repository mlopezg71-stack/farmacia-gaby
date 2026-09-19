-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoUbicacion" AS ENUM ('BODEGA', 'VENTA', 'CUARENTENA', 'TRANSITO');

-- CreateEnum
CREATE TYPE "EstadoLote" AS ENUM ('DISPONIBLE', 'BLOQUEADO', 'RETIRADO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('RECEPCION', 'VENTA', 'APERTURA_ENTRADA', 'APERTURA_SALIDA', 'AJUSTE_ENTRADA', 'AJUSTE_SALIDA', 'TRASLADO_ENTRADA', 'TRASLADO_SALIDA', 'DEVOLUCION', 'BAJA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('ACTIVA', 'CONFIRMADA', 'CONSUMIDA', 'LIBERADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "EstadoDocumento" AS ENUM ('BORRADOR', 'CONFIRMADO', 'PARCIAL', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoTraslado" AS ENUM ('BORRADOR', 'DESPACHADO', 'PARCIAL', 'RECIBIDO', 'CANCELADO');

-- CreateTable
CREATE TABLE "sucursal" (
    "id_sucursal" SERIAL NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "direccion" VARCHAR(500) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "zona" VARCHAR(20),
    "latitud" DECIMAL(10,7),
    "longitud" DECIMAL(10,7),
    "telefono" VARCHAR(25),
    "correo" VARCHAR(254),
    "zona_horaria" VARCHAR(80) NOT NULL DEFAULT 'America/Guatemala',
    "permite_retiro" BOOLEAN NOT NULL DEFAULT true,
    "permite_domicilio" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sucursal_pkey" PRIMARY KEY ("id_sucursal")
);

-- CreateTable
CREATE TABLE "horario_sucursal" (
    "id_horario_sucursal" SERIAL NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "apertura_minuto" INTEGER NOT NULL,
    "cierre_minuto" INTEGER NOT NULL,
    "cierra_dia_siguiente" BOOLEAN NOT NULL DEFAULT false,
    "id_sucursal" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "horario_sucursal_pkey" PRIMARY KEY ("id_horario_sucursal")
);

-- CreateTable
CREATE TABLE "excepcion_horario" (
    "id_excepcion_horario" SERIAL NOT NULL,
    "fecha" DATE NOT NULL,
    "cerrada" BOOLEAN NOT NULL DEFAULT false,
    "motivo" TEXT,
    "id_sucursal" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "excepcion_horario_pkey" PRIMARY KEY ("id_excepcion_horario")
);

-- CreateTable
CREATE TABLE "intervalo_excepcion" (
    "id_intervalo_excepcion" SERIAL NOT NULL,
    "apertura_minuto" INTEGER NOT NULL,
    "cierre_minuto" INTEGER NOT NULL,
    "cierra_dia_siguiente" BOOLEAN NOT NULL DEFAULT false,
    "id_excepcion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "intervalo_excepcion_pkey" PRIMARY KEY ("id_intervalo_excepcion")
);

-- CreateTable
CREATE TABLE "ubicacion_inventario" (
    "id_ubicacion_inventario" SERIAL NOT NULL,
    "codigo" VARCHAR(40) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" "TipoUbicacion" NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "id_sucursal" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "ubicacion_inventario_pkey" PRIMARY KEY ("id_ubicacion_inventario")
);

-- CreateTable
CREATE TABLE "lote" (
    "id_lote" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "numero" VARCHAR(100) NOT NULL,
    "fabricante_referencia" VARCHAR(150) NOT NULL,
    "fecha_fabricacion" DATE,
    "fecha_vencimiento" DATE,
    "estado" "EstadoLote" NOT NULL DEFAULT 'DISPONIBLE',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lote_pkey" PRIMARY KEY ("id_lote")
);

-- CreateTable
CREATE TABLE "existencia" (
    "id_existencia" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "cantidad_fisica" INTEGER NOT NULL DEFAULT 0,
    "cantidad_reservada" INTEGER NOT NULL DEFAULT 0,
    "minimo" INTEGER NOT NULL DEFAULT 0,
    "maximo" INTEGER,
    "version" INTEGER NOT NULL DEFAULT 1,
    "id_ubicacion" INTEGER NOT NULL,
    "id_lote" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "existencia_pkey" PRIMARY KEY ("id_existencia")
);

-- CreateTable
CREATE TABLE "movimiento_inventario" (
    "id_movimiento_inventario" SERIAL NOT NULL,
    "tipo" "TipoMovimiento" NOT NULL,
    "delta" INTEGER NOT NULL,
    "saldo_resultante" INTEGER NOT NULL,
    "id_actor" INTEGER NOT NULL,
    "tipo_documento" VARCHAR(60) NOT NULL,
    "referencia_documento" VARCHAR(100) NOT NULL,
    "motivo" TEXT,
    "clave_idempotencia" VARCHAR(150) NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_existencia" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_inventario_pkey" PRIMARY KEY ("id_movimiento_inventario")
);

-- CreateTable
CREATE TABLE "reserva_inventario" (
    "id_reserva_inventario" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'ACTIVA',
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "confirmada_at" TIMESTAMPTZ(3),
    "consumida_at" TIMESTAMPTZ(3),
    "liberada_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "id_sucursal" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "reserva_inventario_pkey" PRIMARY KEY ("id_reserva_inventario")
);

-- CreateTable
CREATE TABLE "reserva_detalle" (
    "id_reserva_detalle" SERIAL NOT NULL,
    "id_detalle_pedido" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "id_existencia" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "reserva_detalle_pkey" PRIMARY KEY ("id_reserva_detalle")
);

-- CreateTable
CREATE TABLE "evento_reserva" (
    "id_evento_reserva" SERIAL NOT NULL,
    "estado" "EstadoReserva" NOT NULL,
    "motivo" TEXT,
    "id_actor" INTEGER,
    "clave_evento" VARCHAR(120) NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_reserva_pkey" PRIMARY KEY ("id_evento_reserva")
);

-- CreateTable
CREATE TABLE "apertura_empaque" (
    "id_apertura_empaque" SERIAL NOT NULL,
    "id_actor" INTEGER NOT NULL,
    "id_conversion" INTEGER NOT NULL,
    "version_conversion" INTEGER NOT NULL,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "cantidad_origen" INTEGER NOT NULL,
    "cantidad_destino" INTEGER NOT NULL,
    "factor_destino" INTEGER NOT NULL,
    "id_origen" INTEGER NOT NULL,
    "id_destino" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apertura_empaque_pkey" PRIMARY KEY ("id_apertura_empaque")
);

-- CreateTable
CREATE TABLE "proveedor" (
    "id_proveedor" SERIAL NOT NULL,
    "razon_social" VARCHAR(200) NOT NULL,
    "nombre_comercial" VARCHAR(150),
    "identificacion_fiscal" VARCHAR(30),
    "contacto" VARCHAR(150),
    "telefono" VARCHAR(25),
    "correo" VARCHAR(254),
    "direccion" TEXT,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor")
);

-- CreateTable
CREATE TABLE "proveedor_presentacion" (
    "id_proveedor_presentacion" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "codigo_proveedor" VARCHAR(60),
    "costo_referencia" DECIMAL(14,2),
    "plazo_dias" INTEGER,
    "id_proveedor" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "proveedor_presentacion_pkey" PRIMARY KEY ("id_proveedor_presentacion")
);

-- CreateTable
CREATE TABLE "compra" (
    "id_compra" SERIAL NOT NULL,
    "numero" VARCHAR(60) NOT NULL,
    "documento_proveedor" VARCHAR(100),
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "EstadoDocumento" NOT NULL DEFAULT 'BORRADOR',
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "subtotal" DECIMAL(14,2) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "impuesto" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "id_actor" INTEGER NOT NULL,
    "id_proveedor" INTEGER NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "compra_pkey" PRIMARY KEY ("id_compra")
);

-- CreateTable
CREATE TABLE "detalle_compra" (
    "id_detalle_compra" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costo_unitario" DECIMAL(14,2) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "impuesto" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "id_compra" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_compra_pkey" PRIMARY KEY ("id_detalle_compra")
);

-- CreateTable
CREATE TABLE "recepcion" (
    "id_recepcion" SERIAL NOT NULL,
    "recibido_por" INTEGER NOT NULL,
    "referencia" VARCHAR(100),
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_compra" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "recepcion_pkey" PRIMARY KEY ("id_recepcion")
);

-- CreateTable
CREATE TABLE "detalle_recepcion" (
    "id_detalle_recepcion" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_recepcion" INTEGER NOT NULL,
    "id_detalle_compra" INTEGER NOT NULL,
    "id_existencia" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_recepcion_pkey" PRIMARY KEY ("id_detalle_recepcion")
);

-- CreateTable
CREATE TABLE "traslado" (
    "id_traslado" SERIAL NOT NULL,
    "numero" VARCHAR(60) NOT NULL,
    "estado" "EstadoTraslado" NOT NULL DEFAULT 'BORRADOR',
    "despachado_at" TIMESTAMPTZ(3),
    "recibido_at" TIMESTAMPTZ(3),
    "id_actor" INTEGER NOT NULL,
    "id_origen" INTEGER NOT NULL,
    "id_destino" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "traslado_pkey" PRIMARY KEY ("id_traslado")
);

-- CreateTable
CREATE TABLE "detalle_traslado" (
    "id_detalle_traslado" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "cantidad_enviada" INTEGER NOT NULL,
    "cantidad_recibida" INTEGER NOT NULL DEFAULT 0,
    "id_traslado" INTEGER NOT NULL,
    "id_lote" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_traslado_pkey" PRIMARY KEY ("id_detalle_traslado")
);

-- CreateTable
CREATE TABLE "recepcion_traslado" (
    "id_recepcion_traslado" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "recibido_por" INTEGER NOT NULL,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "id_detalle" INTEGER NOT NULL,
    "id_existencia_destino" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recepcion_traslado_pkey" PRIMARY KEY ("id_recepcion_traslado")
);

-- CreateTable
CREATE TABLE "conteo_inventario" (
    "id_conteo_inventario" SERIAL NOT NULL,
    "estado" "EstadoDocumento" NOT NULL DEFAULT 'BORRADOR',
    "responsable" INTEGER NOT NULL,
    "aprobado_por" INTEGER,
    "aprobado_at" TIMESTAMPTZ(3),
    "id_ubicacion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "conteo_inventario_pkey" PRIMARY KEY ("id_conteo_inventario")
);

-- CreateTable
CREATE TABLE "detalle_conteo" (
    "id_detalle_conteo" SERIAL NOT NULL,
    "cantidad_sistema" INTEGER NOT NULL,
    "cantidad_contada" INTEGER NOT NULL,
    "version_existencia" INTEGER NOT NULL,
    "motivo" TEXT,
    "id_conteo" INTEGER NOT NULL,
    "id_existencia" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_conteo_pkey" PRIMARY KEY ("id_detalle_conteo")
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
CREATE UNIQUE INDEX "sucursal_codigo_key" ON "sucursal"("codigo");

-- CreateIndex
CREATE INDEX "horario_sucursal_id_sucursal_idx" ON "horario_sucursal"("id_sucursal");

-- CreateIndex
CREATE UNIQUE INDEX "horario_sucursal_id_sucursal_dia_semana_apertura_minuto_key" ON "horario_sucursal"("id_sucursal", "dia_semana", "apertura_minuto");

-- CreateIndex
CREATE INDEX "excepcion_horario_id_sucursal_idx" ON "excepcion_horario"("id_sucursal");

-- CreateIndex
CREATE UNIQUE INDEX "excepcion_horario_id_sucursal_fecha_key" ON "excepcion_horario"("id_sucursal", "fecha");

-- CreateIndex
CREATE INDEX "intervalo_excepcion_id_excepcion_idx" ON "intervalo_excepcion"("id_excepcion");

-- CreateIndex
CREATE INDEX "ubicacion_inventario_id_sucursal_idx" ON "ubicacion_inventario"("id_sucursal");

-- CreateIndex
CREATE UNIQUE INDEX "ubicacion_inventario_id_sucursal_codigo_key" ON "ubicacion_inventario"("id_sucursal", "codigo");

-- CreateIndex
CREATE INDEX "lote_estado_fecha_vencimiento_idx" ON "lote"("estado", "fecha_vencimiento");

-- CreateIndex
CREATE UNIQUE INDEX "lote_id_producto_numero_fabricante_referencia_key" ON "lote"("id_producto", "numero", "fabricante_referencia");

-- CreateIndex
CREATE INDEX "existencia_id_presentacion_idx" ON "existencia"("id_presentacion");

-- CreateIndex
CREATE INDEX "existencia_id_ubicacion_idx" ON "existencia"("id_ubicacion");

-- CreateIndex
CREATE INDEX "existencia_id_lote_idx" ON "existencia"("id_lote");

-- CreateIndex
CREATE UNIQUE INDEX "existencia_id_ubicacion_id_lote_id_presentacion_key" ON "existencia"("id_ubicacion", "id_lote", "id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "movimiento_inventario_clave_idempotencia_key" ON "movimiento_inventario"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "movimiento_inventario_fecha_idx" ON "movimiento_inventario"("fecha");

-- CreateIndex
CREATE INDEX "movimiento_inventario_tipo_documento_referencia_documento_idx" ON "movimiento_inventario"("tipo_documento", "referencia_documento");

-- CreateIndex
CREATE INDEX "movimiento_inventario_id_existencia_idx" ON "movimiento_inventario"("id_existencia");

-- CreateIndex
CREATE UNIQUE INDEX "reserva_inventario_clave_idempotencia_key" ON "reserva_inventario"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "reserva_inventario_id_pedido_idx" ON "reserva_inventario"("id_pedido");

-- CreateIndex
CREATE INDEX "reserva_inventario_estado_vence_at_idx" ON "reserva_inventario"("estado", "vence_at");

-- CreateIndex
CREATE INDEX "reserva_inventario_id_sucursal_idx" ON "reserva_inventario"("id_sucursal");

-- CreateIndex
CREATE INDEX "reserva_detalle_id_reserva_idx" ON "reserva_detalle"("id_reserva");

-- CreateIndex
CREATE INDEX "reserva_detalle_id_existencia_idx" ON "reserva_detalle"("id_existencia");

-- CreateIndex
CREATE UNIQUE INDEX "reserva_detalle_id_reserva_id_existencia_id_detalle_pedido_key" ON "reserva_detalle"("id_reserva", "id_existencia", "id_detalle_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "evento_reserva_clave_evento_key" ON "evento_reserva"("clave_evento");

-- CreateIndex
CREATE INDEX "evento_reserva_id_reserva_idx" ON "evento_reserva"("id_reserva");

-- CreateIndex
CREATE UNIQUE INDEX "apertura_empaque_clave_idempotencia_key" ON "apertura_empaque"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "apertura_empaque_id_origen_idx" ON "apertura_empaque"("id_origen");

-- CreateIndex
CREATE INDEX "apertura_empaque_id_destino_idx" ON "apertura_empaque"("id_destino");

-- CreateIndex
CREATE UNIQUE INDEX "proveedor_identificacion_fiscal_key" ON "proveedor"("identificacion_fiscal");

-- CreateIndex
CREATE INDEX "proveedor_presentacion_id_proveedor_idx" ON "proveedor_presentacion"("id_proveedor");

-- CreateIndex
CREATE UNIQUE INDEX "proveedor_presentacion_id_proveedor_id_presentacion_key" ON "proveedor_presentacion"("id_proveedor", "id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "compra_numero_key" ON "compra"("numero");

-- CreateIndex
CREATE INDEX "compra_id_proveedor_idx" ON "compra"("id_proveedor");

-- CreateIndex
CREATE INDEX "compra_id_sucursal_idx" ON "compra"("id_sucursal");

-- CreateIndex
CREATE INDEX "detalle_compra_id_compra_idx" ON "detalle_compra"("id_compra");

-- CreateIndex
CREATE UNIQUE INDEX "recepcion_clave_idempotencia_key" ON "recepcion"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "recepcion_id_compra_idx" ON "recepcion"("id_compra");

-- CreateIndex
CREATE INDEX "detalle_recepcion_id_recepcion_idx" ON "detalle_recepcion"("id_recepcion");

-- CreateIndex
CREATE INDEX "detalle_recepcion_id_detalle_compra_idx" ON "detalle_recepcion"("id_detalle_compra");

-- CreateIndex
CREATE INDEX "detalle_recepcion_id_existencia_idx" ON "detalle_recepcion"("id_existencia");

-- CreateIndex
CREATE UNIQUE INDEX "traslado_numero_key" ON "traslado"("numero");

-- CreateIndex
CREATE INDEX "traslado_id_origen_idx" ON "traslado"("id_origen");

-- CreateIndex
CREATE INDEX "traslado_id_destino_idx" ON "traslado"("id_destino");

-- CreateIndex
CREATE INDEX "detalle_traslado_id_traslado_idx" ON "detalle_traslado"("id_traslado");

-- CreateIndex
CREATE INDEX "detalle_traslado_id_lote_idx" ON "detalle_traslado"("id_lote");

-- CreateIndex
CREATE UNIQUE INDEX "recepcion_traslado_clave_idempotencia_key" ON "recepcion_traslado"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "recepcion_traslado_id_detalle_idx" ON "recepcion_traslado"("id_detalle");

-- CreateIndex
CREATE INDEX "recepcion_traslado_id_existencia_destino_idx" ON "recepcion_traslado"("id_existencia_destino");

-- CreateIndex
CREATE INDEX "conteo_inventario_id_ubicacion_idx" ON "conteo_inventario"("id_ubicacion");

-- CreateIndex
CREATE INDEX "detalle_conteo_id_conteo_idx" ON "detalle_conteo"("id_conteo");

-- CreateIndex
CREATE INDEX "detalle_conteo_id_existencia_idx" ON "detalle_conteo"("id_existencia");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_conteo_id_conteo_id_existencia_key" ON "detalle_conteo"("id_conteo", "id_existencia");

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
ALTER TABLE "horario_sucursal" ADD CONSTRAINT "horario_sucursal_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursal"("id_sucursal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "excepcion_horario" ADD CONSTRAINT "excepcion_horario_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursal"("id_sucursal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intervalo_excepcion" ADD CONSTRAINT "intervalo_excepcion_id_excepcion_fkey" FOREIGN KEY ("id_excepcion") REFERENCES "excepcion_horario"("id_excepcion_horario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ubicacion_inventario" ADD CONSTRAINT "ubicacion_inventario_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursal"("id_sucursal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "existencia" ADD CONSTRAINT "existencia_id_ubicacion_fkey" FOREIGN KEY ("id_ubicacion") REFERENCES "ubicacion_inventario"("id_ubicacion_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "existencia" ADD CONSTRAINT "existencia_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lote"("id_lote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_inventario" ADD CONSTRAINT "movimiento_inventario_id_existencia_fkey" FOREIGN KEY ("id_existencia") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_inventario" ADD CONSTRAINT "reserva_inventario_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursal"("id_sucursal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_detalle" ADD CONSTRAINT "reserva_detalle_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva_inventario"("id_reserva_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserva_detalle" ADD CONSTRAINT "reserva_detalle_id_existencia_fkey" FOREIGN KEY ("id_existencia") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_reserva" ADD CONSTRAINT "evento_reserva_id_reserva_fkey" FOREIGN KEY ("id_reserva") REFERENCES "reserva_inventario"("id_reserva_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apertura_empaque" ADD CONSTRAINT "apertura_empaque_id_origen_fkey" FOREIGN KEY ("id_origen") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apertura_empaque" ADD CONSTRAINT "apertura_empaque_id_destino_fkey" FOREIGN KEY ("id_destino") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proveedor_presentacion" ADD CONSTRAINT "proveedor_presentacion_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compra" ADD CONSTRAINT "compra_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "proveedor"("id_proveedor") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compra" ADD CONSTRAINT "compra_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursal"("id_sucursal") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compra" ADD CONSTRAINT "detalle_compra_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compra"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepcion" ADD CONSTRAINT "recepcion_id_compra_fkey" FOREIGN KEY ("id_compra") REFERENCES "compra"("id_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_recepcion" ADD CONSTRAINT "detalle_recepcion_id_recepcion_fkey" FOREIGN KEY ("id_recepcion") REFERENCES "recepcion"("id_recepcion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_recepcion" ADD CONSTRAINT "detalle_recepcion_id_detalle_compra_fkey" FOREIGN KEY ("id_detalle_compra") REFERENCES "detalle_compra"("id_detalle_compra") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_recepcion" ADD CONSTRAINT "detalle_recepcion_id_existencia_fkey" FOREIGN KEY ("id_existencia") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslado" ADD CONSTRAINT "traslado_id_origen_fkey" FOREIGN KEY ("id_origen") REFERENCES "ubicacion_inventario"("id_ubicacion_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "traslado" ADD CONSTRAINT "traslado_id_destino_fkey" FOREIGN KEY ("id_destino") REFERENCES "ubicacion_inventario"("id_ubicacion_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_traslado" ADD CONSTRAINT "detalle_traslado_id_traslado_fkey" FOREIGN KEY ("id_traslado") REFERENCES "traslado"("id_traslado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_traslado" ADD CONSTRAINT "detalle_traslado_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "lote"("id_lote") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepcion_traslado" ADD CONSTRAINT "recepcion_traslado_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_traslado"("id_detalle_traslado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recepcion_traslado" ADD CONSTRAINT "recepcion_traslado_id_existencia_destino_fkey" FOREIGN KEY ("id_existencia_destino") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conteo_inventario" ADD CONSTRAINT "conteo_inventario_id_ubicacion_fkey" FOREIGN KEY ("id_ubicacion") REFERENCES "ubicacion_inventario"("id_ubicacion_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_conteo" ADD CONSTRAINT "detalle_conteo_id_conteo_fkey" FOREIGN KEY ("id_conteo") REFERENCES "conteo_inventario"("id_conteo_inventario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_conteo" ADD CONSTRAINT "detalle_conteo_id_existencia_fkey" FOREIGN KEY ("id_existencia") REFERENCES "existencia"("id_existencia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "entrega_notificacion_id_notificacion_fkey" FOREIGN KEY ("id_notificacion") REFERENCES "notificacion"("id_notificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- INVARIANTES V05
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
