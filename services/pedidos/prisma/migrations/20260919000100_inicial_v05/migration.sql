-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoCarrito" AS ENUM ('ACTIVO', 'CONVERTIDO', 'ABANDONADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('BORRADOR', 'PENDIENTE_RECETA', 'PENDIENTE_CONFIRMACION', 'CONFIRMADO', 'PREPARANDO', 'LISTO', 'EN_ENTREGA', 'COMPLETADO', 'CANCELADO', 'REVISION');

-- CreateEnum
CREATE TYPE "CanalPedido" AS ENUM ('WEB', 'MOSTRADOR');

-- CreateEnum
CREATE TYPE "ModalidadPedido" AS ENUM ('DOMICILIO', 'RETIRO', 'MOSTRADOR');

-- CreateEnum
CREATE TYPE "EstadoReceta" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA', 'VENCIDA');

-- CreateEnum
CREATE TYPE "EstadoAplicacion" AS ENUM ('RESERVADA', 'CONFIRMADA', 'LIBERADA');

-- CreateEnum
CREATE TYPE "EstadoEnvio" AS ENUM ('PENDIENTE', 'PREPARANDO', 'EN_RUTA', 'ENTREGADO', 'FALLIDO', 'DEVUELTO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "EstadoDevolucion" AS ENUM ('SOLICITADA', 'AUTORIZADA', 'RECHAZADA', 'RECIBIDA', 'CERRADA');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('ABIERTA', 'EN_PROCESO', 'RESUELTA', 'CERRADA');

-- CreateEnum
CREATE TYPE "TipoSolicitud" AS ENUM ('CONSULTA', 'SUGERENCIA', 'RECLAMO', 'EMPRESA');

-- CreateEnum
CREATE TYPE "EstadoModeracion" AS ENUM ('PENDIENTE', 'APROBADA', 'RECHAZADA');

-- CreateEnum
CREATE TYPE "EstadoCotizacion" AS ENUM ('BORRADOR', 'EMITIDA', 'ACEPTADA', 'VENCIDA', 'CANCELADA');

-- CreateTable
CREATE TABLE "carrito" (
    "id_carrito" SERIAL NOT NULL,
    "id_cliente" INTEGER,
    "token_invitado_hash" VARCHAR(128),
    "estado" "EstadoCarrito" NOT NULL DEFAULT 'ACTIVO',
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "id_sucursal" INTEGER,
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id_carrito")
);

-- CreateTable
CREATE TABLE "item_carrito" (
    "id_item_carrito" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_observado" DECIMAL(14,2),
    "id_carrito" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "item_carrito_pkey" PRIMARY KEY ("id_item_carrito")
);

-- CreateTable
CREATE TABLE "favorito" (
    "id_favorito" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "favorito_pkey" PRIMARY KEY ("id_favorito")
);

-- CreateTable
CREATE TABLE "alerta_disponibilidad" (
    "id_alerta_disponibilidad" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "id_sucursal" INTEGER,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "enviada_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "alerta_disponibilidad_pkey" PRIMARY KEY ("id_alerta_disponibilidad")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id_pedido" SERIAL NOT NULL,
    "numero" VARCHAR(60) NOT NULL,
    "id_cliente" INTEGER,
    "id_empleado_gestiona" INTEGER,
    "id_sucursal" INTEGER NOT NULL,
    "canal" "CanalPedido" NOT NULL DEFAULT 'WEB',
    "modalidad" "ModalidadPedido" NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'BORRADOR',
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "subtotal" DECIMAL(14,2) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "impuesto" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "envio" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "cotizacion_externa" VARCHAR(100),
    "version_precios" VARCHAR(100),
    "cotizacion_vence_at" TIMESTAMPTZ(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "confirmado_at" TIMESTAMPTZ(3),
    "cancelado_at" TIMESTAMPTZ(3),
    "motivo_cancelacion" TEXT,
    "id_carrito" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id_pedido")
);

-- CreateTable
CREATE TABLE "pedido_contacto" (
    "id_pedido_contacto" SERIAL NOT NULL,
    "comprador_nombre" VARCHAR(150) NOT NULL,
    "comprador_correo" VARCHAR(254),
    "comprador_telefono" VARCHAR(25) NOT NULL,
    "destinatario" VARCHAR(150),
    "telefono_entrega" VARCHAR(25),
    "departamento" VARCHAR(100),
    "municipio" VARCHAR(100),
    "zona" VARCHAR(20),
    "direccion" VARCHAR(500),
    "referencias" TEXT,
    "latitud" DECIMAL(10,7),
    "longitud" DECIMAL(10,7),
    "instrucciones" TEXT,
    "id_pedido" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pedido_contacto_pkey" PRIMARY KEY ("id_pedido_contacto")
);

-- CreateTable
CREATE TABLE "pedido_facturacion" (
    "id_pedido_facturacion" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "identificacion_fiscal" VARCHAR(30),
    "direccion" TEXT,
    "correo" VARCHAR(254),
    "id_pedido" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pedido_facturacion_pkey" PRIMARY KEY ("id_pedido_facturacion")
);

-- CreateTable
CREATE TABLE "detalle_pedido" (
    "id_detalle_pedido" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "sku" VARCHAR(60) NOT NULL,
    "nombre_producto" VARCHAR(200) NOT NULL,
    "presentacion" VARCHAR(150) NOT NULL,
    "unidades_base" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(16,6) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "base_imponible" DECIMAL(14,2) NOT NULL,
    "tasa_impuesto" DECIMAL(7,4) NOT NULL,
    "impuesto" DECIMAL(14,2) NOT NULL,
    "total_linea" DECIMAL(14,2) NOT NULL,
    "requiere_receta" BOOLEAN NOT NULL,
    "cantidad_cancelada" INTEGER NOT NULL DEFAULT 0,
    "cantidad_atendida" INTEGER NOT NULL DEFAULT 0,
    "id_pedido" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_pedido_pkey" PRIMARY KEY ("id_detalle_pedido")
);

-- CreateTable
CREATE TABLE "pedido_reserva" (
    "id_pedido_reserva" SERIAL NOT NULL,
    "id_reserva" INTEGER NOT NULL,
    "estado_inventario" VARCHAR(30) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "version_evento" INTEGER NOT NULL DEFAULT 0,
    "id_detalle" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pedido_reserva_pkey" PRIMARY KEY ("id_pedido_reserva")
);

-- CreateTable
CREATE TABLE "historial_pedido" (
    "id_historial_pedido" SERIAL NOT NULL,
    "estado_anterior" "EstadoPedido",
    "estado_nuevo" "EstadoPedido" NOT NULL,
    "motivo" TEXT,
    "id_actor" INTEGER,
    "evento_origen" VARCHAR(120) NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_pedido_pkey" PRIMARY KEY ("id_historial_pedido")
);

-- CreateTable
CREATE TABLE "aplicacion_promocion" (
    "id_aplicacion_promocion" SERIAL NOT NULL,
    "id_promocion" INTEGER NOT NULL,
    "id_cupon" INTEGER,
    "id_uso_promocion" INTEGER NOT NULL,
    "version_reglas" INTEGER NOT NULL,
    "reglas_resumen" JSONB NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_detalle" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "aplicacion_promocion_pkey" PRIMARY KEY ("id_aplicacion_promocion")
);

-- CreateTable
CREATE TABLE "cotizacion" (
    "id_cotizacion" SERIAL NOT NULL,
    "numero" VARCHAR(60) NOT NULL,
    "id_cliente" INTEGER,
    "empresa_nombre" TEXT,
    "contacto" TEXT NOT NULL,
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "estado" "EstadoCotizacion" NOT NULL DEFAULT 'BORRADOR',
    "total" DECIMAL(14,2) NOT NULL,
    "id_pedido" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cotizacion_pkey" PRIMARY KEY ("id_cotizacion")
);

-- CreateTable
CREATE TABLE "detalle_cotizacion" (
    "id_detalle_cotizacion" SERIAL NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(14,2) NOT NULL,
    "descuento" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "impuesto" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(14,2) NOT NULL,
    "id_cotizacion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_cotizacion_pkey" PRIMARY KEY ("id_detalle_cotizacion")
);

-- CreateTable
CREATE TABLE "receta" (
    "id_receta" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "emisor_nombre" VARCHAR(150),
    "emisor_identificacion" VARCHAR(100),
    "fecha_emision" DATE,
    "vigente_hasta" DATE,
    "estado" "EstadoReceta" NOT NULL DEFAULT 'PENDIENTE',
    "revisado_por" INTEGER,
    "revisado_at" TIMESTAMPTZ(3),
    "motivo_rechazo" TEXT,
    "eliminar_despues" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "receta_pkey" PRIMARY KEY ("id_receta")
);

-- CreateTable
CREATE TABLE "receta_archivo" (
    "id_receta_archivo" SERIAL NOT NULL,
    "clave_privada" TEXT NOT NULL,
    "mime" VARCHAR(100) NOT NULL,
    "tamano_bytes" INTEGER NOT NULL,
    "hash_integridad" VARCHAR(128) NOT NULL,
    "estado_escaneo" VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
    "id_receta" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "receta_archivo_pkey" PRIMARY KEY ("id_receta_archivo")
);

-- CreateTable
CREATE TABLE "receta_linea" (
    "id_receta_linea" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "id_presentacion" INTEGER,
    "cantidad_autorizada" INTEGER,
    "unidad_autorizada" VARCHAR(60),
    "observacion" TEXT,
    "id_receta" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "receta_linea_pkey" PRIMARY KEY ("id_receta_linea")
);

-- CreateTable
CREATE TABLE "receta_aplicacion" (
    "id_receta_aplicacion" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "estado" "EstadoAplicacion" NOT NULL DEFAULT 'RESERVADA',
    "aprobado_por" INTEGER,
    "aprobado_at" TIMESTAMPTZ(3),
    "id_linea" INTEGER NOT NULL,
    "id_detalle" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "receta_aplicacion_pkey" PRIMARY KEY ("id_receta_aplicacion")
);

-- CreateTable
CREATE TABLE "zona_entrega" (
    "id_zona_entrega" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "zonas" TEXT[],
    "poligono_geojson" JSONB,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "zona_entrega_pkey" PRIMARY KEY ("id_zona_entrega")
);

-- CreateTable
CREATE TABLE "tarifa_entrega" (
    "id_tarifa_entrega" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "importe" DECIMAL(14,2) NOT NULL,
    "umbral_gratis" DECIMAL(14,2),
    "minimo_compra" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "plazo_minutos" INTEGER,
    "desde" TIMESTAMPTZ(3) NOT NULL,
    "hasta" TIMESTAMPTZ(3),
    "id_zona" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "tarifa_entrega_pkey" PRIMARY KEY ("id_tarifa_entrega")
);

-- CreateTable
CREATE TABLE "franja_entrega" (
    "id_franja_entrega" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "inicio" TIMESTAMPTZ(3) NOT NULL,
    "fin" TIMESTAMPTZ(3) NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "id_zona" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "franja_entrega_pkey" PRIMARY KEY ("id_franja_entrega")
);

-- CreateTable
CREATE TABLE "envio" (
    "id_envio" SERIAL NOT NULL,
    "numero_seguimiento" VARCHAR(100) NOT NULL,
    "id_repartidor" INTEGER,
    "transportista" VARCHAR(100),
    "estado" "EstadoEnvio" NOT NULL DEFAULT 'PENDIENTE',
    "destino_historico" JSONB NOT NULL,
    "programado_at" TIMESTAMPTZ(3),
    "despachado_at" TIMESTAMPTZ(3),
    "entregado_at" TIMESTAMPTZ(3),
    "receptor" VARCHAR(150),
    "evidencia_privada" TEXT,
    "costo" DECIMAL(14,2) NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_franja" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "envio_pkey" PRIMARY KEY ("id_envio")
);

-- CreateTable
CREATE TABLE "envio_detalle" (
    "id_envio_detalle" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "id_envio" INTEGER NOT NULL,
    "id_detalle" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "envio_detalle_pkey" PRIMARY KEY ("id_envio_detalle")
);

-- CreateTable
CREATE TABLE "evento_envio" (
    "id_evento_envio" SERIAL NOT NULL,
    "estado" "EstadoEnvio" NOT NULL,
    "motivo" TEXT,
    "id_actor" INTEGER,
    "clave_evento" VARCHAR(120) NOT NULL,
    "id_envio" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evento_envio_pkey" PRIMARY KEY ("id_evento_envio")
);

-- CreateTable
CREATE TABLE "intento_entrega" (
    "id_intento_entrega" SERIAL NOT NULL,
    "fecha" TIMESTAMPTZ(3) NOT NULL,
    "resultado" VARCHAR(60) NOT NULL,
    "motivo" TEXT,
    "proximo_intento" TIMESTAMPTZ(3),
    "evidencia_privada" TEXT,
    "id_envio" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "intento_entrega_pkey" PRIMARY KEY ("id_intento_entrega")
);

-- CreateTable
CREATE TABLE "retiro_pedido" (
    "id_retiro_pedido" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "codigo_hash" VARCHAR(128) NOT NULL,
    "retirado_at" TIMESTAMPTZ(3),
    "entregado_por" INTEGER,
    "id_pedido" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "retiro_pedido_pkey" PRIMARY KEY ("id_retiro_pedido")
);

-- CreateTable
CREATE TABLE "devolucion" (
    "id_devolucion" SERIAL NOT NULL,
    "motivo" TEXT NOT NULL,
    "estado" "EstadoDevolucion" NOT NULL DEFAULT 'SOLICITADA',
    "autorizado_por" INTEGER,
    "recibido_at" TIMESTAMPTZ(3),
    "id_pedido" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "devolucion_pkey" PRIMARY KEY ("id_devolucion")
);

-- CreateTable
CREATE TABLE "detalle_devolucion" (
    "id_detalle_devolucion" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "condicion" TEXT,
    "decision_inventario" VARCHAR(60),
    "referencia_recepcion_inventario" TEXT,
    "id_reembolso" INTEGER,
    "id_devolucion" INTEGER NOT NULL,
    "id_detalle" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "detalle_devolucion_pkey" PRIMARY KEY ("id_detalle_devolucion")
);

-- CreateTable
CREATE TABLE "solicitud_contacto" (
    "id_solicitud_contacto" SERIAL NOT NULL,
    "id_cliente" INTEGER,
    "nombre" VARCHAR(150) NOT NULL,
    "contacto" VARCHAR(254) NOT NULL,
    "empresa" VARCHAR(200),
    "tipo" "TipoSolicitud" NOT NULL,
    "asunto" VARCHAR(200) NOT NULL,
    "mensaje" TEXT NOT NULL,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'ABIERTA',
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "asignado_a" INTEGER,
    "id_pedido" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "solicitud_contacto_pkey" PRIMARY KEY ("id_solicitud_contacto")
);

-- CreateTable
CREATE TABLE "respuesta_contacto" (
    "id_respuesta_contacto" SERIAL NOT NULL,
    "id_autor" INTEGER,
    "respuesta" TEXT NOT NULL,
    "canal" VARCHAR(30) NOT NULL,
    "interna" BOOLEAN NOT NULL DEFAULT false,
    "id_solicitud" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "respuesta_contacto_pkey" PRIMARY KEY ("id_respuesta_contacto")
);

-- CreateTable
CREATE TABLE "resena_producto" (
    "id_resena_producto" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "estado" "EstadoModeracion" NOT NULL DEFAULT 'PENDIENTE',
    "moderado_por" INTEGER,
    "motivo_moderacion" TEXT,
    "id_detalle" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "resena_producto_pkey" PRIMARY KEY ("id_resena_producto")
);

-- CreateTable
CREATE TABLE "afiliacion_programa" (
    "id_afiliacion_programa" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_programa" INTEGER NOT NULL,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "vence_at" TIMESTAMPTZ(3),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "afiliacion_programa_pkey" PRIMARY KEY ("id_afiliacion_programa")
);

-- CreateTable
CREATE TABLE "movimiento_puntos" (
    "id_movimiento_puntos" SERIAL NOT NULL,
    "puntos" INTEGER NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "vence_at" TIMESTAMPTZ(3),
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "id_afiliacion" INTEGER NOT NULL,
    "id_pedido" INTEGER,
    "id_movimiento_origen" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimiento_puntos_pkey" PRIMARY KEY ("id_movimiento_puntos")
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
CREATE INDEX "carrito_id_cliente_idx" ON "carrito"("id_cliente");

-- CreateIndex
CREATE INDEX "carrito_token_invitado_hash_idx" ON "carrito"("token_invitado_hash");

-- CreateIndex
CREATE INDEX "carrito_estado_vence_at_idx" ON "carrito"("estado", "vence_at");

-- CreateIndex
CREATE INDEX "item_carrito_id_carrito_idx" ON "item_carrito"("id_carrito");

-- CreateIndex
CREATE UNIQUE INDEX "item_carrito_id_carrito_id_presentacion_key" ON "item_carrito"("id_carrito", "id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "favorito_id_cliente_id_producto_key" ON "favorito"("id_cliente", "id_producto");

-- CreateIndex
CREATE INDEX "alerta_disponibilidad_id_presentacion_activa_idx" ON "alerta_disponibilidad"("id_presentacion", "activa");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_numero_key" ON "pedido"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_clave_idempotencia_key" ON "pedido"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "pedido_id_cliente_created_at_idx" ON "pedido"("id_cliente", "created_at");

-- CreateIndex
CREATE INDEX "pedido_id_sucursal_estado_idx" ON "pedido"("id_sucursal", "estado");

-- CreateIndex
CREATE INDEX "pedido_estado_created_at_idx" ON "pedido"("estado", "created_at");

-- CreateIndex
CREATE INDEX "pedido_id_carrito_idx" ON "pedido"("id_carrito");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_id_carrito_key" ON "pedido"("id_carrito");

-- CreateIndex
CREATE INDEX "pedido_contacto_id_pedido_idx" ON "pedido_contacto"("id_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_contacto_id_pedido_key" ON "pedido_contacto"("id_pedido");

-- CreateIndex
CREATE INDEX "pedido_facturacion_id_pedido_idx" ON "pedido_facturacion"("id_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_facturacion_id_pedido_key" ON "pedido_facturacion"("id_pedido");

-- CreateIndex
CREATE INDEX "detalle_pedido_id_presentacion_idx" ON "detalle_pedido"("id_presentacion");

-- CreateIndex
CREATE INDEX "detalle_pedido_id_pedido_idx" ON "detalle_pedido"("id_pedido");

-- CreateIndex
CREATE INDEX "pedido_reserva_id_detalle_idx" ON "pedido_reserva"("id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "pedido_reserva_id_detalle_id_reserva_key" ON "pedido_reserva"("id_detalle", "id_reserva");

-- CreateIndex
CREATE UNIQUE INDEX "historial_pedido_evento_origen_key" ON "historial_pedido"("evento_origen");

-- CreateIndex
CREATE INDEX "historial_pedido_id_pedido_idx" ON "historial_pedido"("id_pedido");

-- CreateIndex
CREATE INDEX "aplicacion_promocion_id_uso_promocion_idx" ON "aplicacion_promocion"("id_uso_promocion");

-- CreateIndex
CREATE INDEX "aplicacion_promocion_id_pedido_idx" ON "aplicacion_promocion"("id_pedido");

-- CreateIndex
CREATE INDEX "aplicacion_promocion_id_detalle_idx" ON "aplicacion_promocion"("id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "cotizacion_numero_key" ON "cotizacion"("numero");

-- CreateIndex
CREATE INDEX "cotizacion_id_pedido_idx" ON "cotizacion"("id_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "cotizacion_id_pedido_key" ON "cotizacion"("id_pedido");

-- CreateIndex
CREATE INDEX "detalle_cotizacion_id_cotizacion_idx" ON "detalle_cotizacion"("id_cotizacion");

-- CreateIndex
CREATE INDEX "receta_id_cliente_estado_idx" ON "receta"("id_cliente", "estado");

-- CreateIndex
CREATE INDEX "receta_archivo_id_receta_idx" ON "receta_archivo"("id_receta");

-- CreateIndex
CREATE INDEX "receta_linea_id_receta_idx" ON "receta_linea"("id_receta");

-- CreateIndex
CREATE INDEX "receta_aplicacion_id_linea_idx" ON "receta_aplicacion"("id_linea");

-- CreateIndex
CREATE INDEX "receta_aplicacion_id_detalle_idx" ON "receta_aplicacion"("id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "receta_aplicacion_id_linea_id_detalle_key" ON "receta_aplicacion"("id_linea", "id_detalle");

-- CreateIndex
CREATE INDEX "tarifa_entrega_id_zona_idx" ON "tarifa_entrega"("id_zona");

-- CreateIndex
CREATE INDEX "franja_entrega_id_zona_idx" ON "franja_entrega"("id_zona");

-- CreateIndex
CREATE UNIQUE INDEX "envio_numero_seguimiento_key" ON "envio"("numero_seguimiento");

-- CreateIndex
CREATE INDEX "envio_id_repartidor_estado_idx" ON "envio"("id_repartidor", "estado");

-- CreateIndex
CREATE INDEX "envio_id_pedido_idx" ON "envio"("id_pedido");

-- CreateIndex
CREATE INDEX "envio_id_franja_idx" ON "envio"("id_franja");

-- CreateIndex
CREATE INDEX "envio_detalle_id_envio_idx" ON "envio_detalle"("id_envio");

-- CreateIndex
CREATE INDEX "envio_detalle_id_detalle_idx" ON "envio_detalle"("id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "envio_detalle_id_envio_id_detalle_key" ON "envio_detalle"("id_envio", "id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "evento_envio_clave_evento_key" ON "evento_envio"("clave_evento");

-- CreateIndex
CREATE INDEX "evento_envio_id_envio_idx" ON "evento_envio"("id_envio");

-- CreateIndex
CREATE INDEX "intento_entrega_id_envio_idx" ON "intento_entrega"("id_envio");

-- CreateIndex
CREATE UNIQUE INDEX "retiro_pedido_codigo_hash_key" ON "retiro_pedido"("codigo_hash");

-- CreateIndex
CREATE INDEX "retiro_pedido_id_pedido_idx" ON "retiro_pedido"("id_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "retiro_pedido_id_pedido_key" ON "retiro_pedido"("id_pedido");

-- CreateIndex
CREATE INDEX "devolucion_id_pedido_idx" ON "devolucion"("id_pedido");

-- CreateIndex
CREATE INDEX "detalle_devolucion_id_devolucion_idx" ON "detalle_devolucion"("id_devolucion");

-- CreateIndex
CREATE INDEX "detalle_devolucion_id_detalle_idx" ON "detalle_devolucion"("id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "detalle_devolucion_id_devolucion_id_detalle_key" ON "detalle_devolucion"("id_devolucion", "id_detalle");

-- CreateIndex
CREATE INDEX "solicitud_contacto_estado_created_at_idx" ON "solicitud_contacto"("estado", "created_at");

-- CreateIndex
CREATE INDEX "solicitud_contacto_id_pedido_idx" ON "solicitud_contacto"("id_pedido");

-- CreateIndex
CREATE INDEX "respuesta_contacto_id_solicitud_idx" ON "respuesta_contacto"("id_solicitud");

-- CreateIndex
CREATE INDEX "resena_producto_id_detalle_idx" ON "resena_producto"("id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "resena_producto_id_cliente_id_detalle_key" ON "resena_producto"("id_cliente", "id_detalle");

-- CreateIndex
CREATE UNIQUE INDEX "afiliacion_programa_id_cliente_id_programa_key" ON "afiliacion_programa"("id_cliente", "id_programa");

-- CreateIndex
CREATE UNIQUE INDEX "movimiento_puntos_clave_idempotencia_key" ON "movimiento_puntos"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "movimiento_puntos_id_afiliacion_idx" ON "movimiento_puntos"("id_afiliacion");

-- CreateIndex
CREATE INDEX "movimiento_puntos_id_pedido_idx" ON "movimiento_puntos"("id_pedido");

-- CreateIndex
CREATE INDEX "movimiento_puntos_id_movimiento_origen_idx" ON "movimiento_puntos"("id_movimiento_origen");

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
ALTER TABLE "item_carrito" ADD CONSTRAINT "item_carrito_id_carrito_fkey" FOREIGN KEY ("id_carrito") REFERENCES "carrito"("id_carrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_id_carrito_fkey" FOREIGN KEY ("id_carrito") REFERENCES "carrito"("id_carrito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_contacto" ADD CONSTRAINT "pedido_contacto_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_facturacion" ADD CONSTRAINT "pedido_facturacion_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "detalle_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_reserva" ADD CONSTRAINT "pedido_reserva_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_pedido"("id_detalle_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_pedido" ADD CONSTRAINT "historial_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacion_promocion" ADD CONSTRAINT "aplicacion_promocion_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aplicacion_promocion" ADD CONSTRAINT "aplicacion_promocion_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_pedido"("id_detalle_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cotizacion" ADD CONSTRAINT "cotizacion_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_cotizacion" ADD CONSTRAINT "detalle_cotizacion_id_cotizacion_fkey" FOREIGN KEY ("id_cotizacion") REFERENCES "cotizacion"("id_cotizacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta_archivo" ADD CONSTRAINT "receta_archivo_id_receta_fkey" FOREIGN KEY ("id_receta") REFERENCES "receta"("id_receta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta_linea" ADD CONSTRAINT "receta_linea_id_receta_fkey" FOREIGN KEY ("id_receta") REFERENCES "receta"("id_receta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta_aplicacion" ADD CONSTRAINT "receta_aplicacion_id_linea_fkey" FOREIGN KEY ("id_linea") REFERENCES "receta_linea"("id_receta_linea") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receta_aplicacion" ADD CONSTRAINT "receta_aplicacion_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_pedido"("id_detalle_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifa_entrega" ADD CONSTRAINT "tarifa_entrega_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "zona_entrega"("id_zona_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "franja_entrega" ADD CONSTRAINT "franja_entrega_id_zona_fkey" FOREIGN KEY ("id_zona") REFERENCES "zona_entrega"("id_zona_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envio" ADD CONSTRAINT "envio_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envio" ADD CONSTRAINT "envio_id_franja_fkey" FOREIGN KEY ("id_franja") REFERENCES "franja_entrega"("id_franja_entrega") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envio_detalle" ADD CONSTRAINT "envio_detalle_id_envio_fkey" FOREIGN KEY ("id_envio") REFERENCES "envio"("id_envio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envio_detalle" ADD CONSTRAINT "envio_detalle_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_pedido"("id_detalle_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evento_envio" ADD CONSTRAINT "evento_envio_id_envio_fkey" FOREIGN KEY ("id_envio") REFERENCES "envio"("id_envio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "intento_entrega" ADD CONSTRAINT "intento_entrega_id_envio_fkey" FOREIGN KEY ("id_envio") REFERENCES "envio"("id_envio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retiro_pedido" ADD CONSTRAINT "retiro_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devolucion" ADD CONSTRAINT "devolucion_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion" ADD CONSTRAINT "detalle_devolucion_id_devolucion_fkey" FOREIGN KEY ("id_devolucion") REFERENCES "devolucion"("id_devolucion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_devolucion" ADD CONSTRAINT "detalle_devolucion_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_pedido"("id_detalle_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_contacto" ADD CONSTRAINT "solicitud_contacto_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuesta_contacto" ADD CONSTRAINT "respuesta_contacto_id_solicitud_fkey" FOREIGN KEY ("id_solicitud") REFERENCES "solicitud_contacto"("id_solicitud_contacto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resena_producto" ADD CONSTRAINT "resena_producto_id_detalle_fkey" FOREIGN KEY ("id_detalle") REFERENCES "detalle_pedido"("id_detalle_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_puntos" ADD CONSTRAINT "movimiento_puntos_id_afiliacion_fkey" FOREIGN KEY ("id_afiliacion") REFERENCES "afiliacion_programa"("id_afiliacion_programa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_puntos" ADD CONSTRAINT "movimiento_puntos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedido"("id_pedido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_puntos" ADD CONSTRAINT "movimiento_puntos_id_movimiento_origen_fkey" FOREIGN KEY ("id_movimiento_origen") REFERENCES "movimiento_puntos"("id_movimiento_puntos") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "entrega_notificacion_id_notificacion_fkey" FOREIGN KEY ("id_notificacion") REFERENCES "notificacion"("id_notificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- INVARIANTES V05
-- Complemento de la migración INICIAL generada por Prisma para pedidos.
-- No ejecutar solo: las tablas deben crearse antes en esa misma migración.
-- Prisma no representa estos CHECK/índices funcionales/parciales en schema.prisma.

ALTER TABLE "carrito" ADD CONSTRAINT "ck_carrito_1" CHECK ((id_cliente IS NOT NULL) <> (token_invitado_hash IS NOT NULL));
ALTER TABLE "item_carrito" ADD CONSTRAINT "ck_item_carrito_1" CHECK (cantidad > 0);
ALTER TABLE "item_carrito" ADD CONSTRAINT "ck_item_carrito_2" CHECK (precio_observado IS NULL OR precio_observado >= 0);
ALTER TABLE "pedido" ADD CONSTRAINT "ck_pedido_1" CHECK (subtotal >= 0);
ALTER TABLE "pedido" ADD CONSTRAINT "ck_pedido_2" CHECK (descuento BETWEEN 0 AND subtotal);
ALTER TABLE "pedido" ADD CONSTRAINT "ck_pedido_3" CHECK (impuesto >= 0);
ALTER TABLE "pedido" ADD CONSTRAINT "ck_pedido_4" CHECK (envio >= 0);
ALTER TABLE "pedido" ADD CONSTRAINT "ck_pedido_5" CHECK (total = subtotal - descuento + impuesto + envio);
ALTER TABLE "pedido_contacto" ADD CONSTRAINT "ck_pedido_contacto_1" CHECK (latitud IS NULL OR latitud BETWEEN -90 AND 90);
ALTER TABLE "pedido_contacto" ADD CONSTRAINT "ck_pedido_contacto_2" CHECK (longitud IS NULL OR longitud BETWEEN -180 AND 180);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_1" CHECK (cantidad > 0);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_2" CHECK (unidades_base > 0);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_3" CHECK (precio_unitario >= 0);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_4" CHECK (descuento >= 0);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_5" CHECK (base_imponible >= 0);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_6" CHECK (tasa_impuesto BETWEEN 0 AND 1);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_7" CHECK (impuesto >= 0);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_8" CHECK (total_linea = base_imponible + impuesto);
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "ck_detalle_pedido_9" CHECK (cantidad_cancelada >= 0 AND cantidad_atendida >= 0 AND cantidad_cancelada + cantidad_atendida <= cantidad);
ALTER TABLE "pedido_reserva" ADD CONSTRAINT "ck_pedido_reserva_1" CHECK (cantidad > 0);
ALTER TABLE "aplicacion_promocion" ADD CONSTRAINT "ck_aplicacion_promocion_1" CHECK (monto >= 0);
ALTER TABLE "cotizacion" ADD CONSTRAINT "ck_cotizacion_1" CHECK (total >= 0);
ALTER TABLE "detalle_cotizacion" ADD CONSTRAINT "ck_detalle_cotizacion_1" CHECK (cantidad > 0);
ALTER TABLE "detalle_cotizacion" ADD CONSTRAINT "ck_detalle_cotizacion_2" CHECK (precio_unitario >= 0);
ALTER TABLE "detalle_cotizacion" ADD CONSTRAINT "ck_detalle_cotizacion_3" CHECK (descuento >= 0);
ALTER TABLE "detalle_cotizacion" ADD CONSTRAINT "ck_detalle_cotizacion_4" CHECK (impuesto >= 0);
ALTER TABLE "detalle_cotizacion" ADD CONSTRAINT "ck_detalle_cotizacion_5" CHECK (total >= 0);
ALTER TABLE "receta" ADD CONSTRAINT "ck_receta_1" CHECK (vigente_hasta IS NULL OR fecha_emision IS NULL OR vigente_hasta >= fecha_emision);
ALTER TABLE "receta_archivo" ADD CONSTRAINT "ck_receta_archivo_1" CHECK (tamano_bytes > 0);
ALTER TABLE "receta_linea" ADD CONSTRAINT "ck_receta_linea_1" CHECK (cantidad_autorizada IS NULL OR cantidad_autorizada > 0);
ALTER TABLE "receta_aplicacion" ADD CONSTRAINT "ck_receta_aplicacion_1" CHECK (cantidad > 0);
ALTER TABLE "tarifa_entrega" ADD CONSTRAINT "ck_tarifa_entrega_1" CHECK (importe >= 0);
ALTER TABLE "tarifa_entrega" ADD CONSTRAINT "ck_tarifa_entrega_2" CHECK (minimo_compra >= 0);
ALTER TABLE "tarifa_entrega" ADD CONSTRAINT "ck_tarifa_entrega_3" CHECK (umbral_gratis IS NULL OR umbral_gratis >= 0);
ALTER TABLE "tarifa_entrega" ADD CONSTRAINT "ck_tarifa_entrega_4" CHECK (plazo_minutos IS NULL OR plazo_minutos > 0);
ALTER TABLE "tarifa_entrega" ADD CONSTRAINT "ck_tarifa_entrega_5" CHECK (hasta IS NULL OR hasta > desde);
ALTER TABLE "franja_entrega" ADD CONSTRAINT "ck_franja_entrega_1" CHECK (fin > inicio);
ALTER TABLE "franja_entrega" ADD CONSTRAINT "ck_franja_entrega_2" CHECK (capacidad > 0);
ALTER TABLE "envio" ADD CONSTRAINT "ck_envio_1" CHECK (costo >= 0);
ALTER TABLE "envio_detalle" ADD CONSTRAINT "ck_envio_detalle_1" CHECK (cantidad > 0);
ALTER TABLE "detalle_devolucion" ADD CONSTRAINT "ck_detalle_devolucion_1" CHECK (cantidad > 0);
ALTER TABLE "resena_producto" ADD CONSTRAINT "ck_resena_producto_1" CHECK (calificacion BETWEEN 1 AND 5);
ALTER TABLE "movimiento_puntos" ADD CONSTRAINT "ck_movimiento_puntos_1" CHECK (puntos <> 0);
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "ck_entrega_notificacion_1" CHECK (intento > 0);
CREATE UNIQUE INDEX "uq_carrito_activo_cliente" ON "carrito" (id_cliente) WHERE estado = 'ACTIVO' AND id_cliente IS NOT NULL;
CREATE UNIQUE INDEX "uq_carrito_activo_invitado" ON "carrito" (token_invitado_hash) WHERE estado = 'ACTIVO' AND token_invitado_hash IS NOT NULL;
