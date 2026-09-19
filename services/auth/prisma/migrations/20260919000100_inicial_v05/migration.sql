-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "TipoToken" AS ENUM ('VERIFICAR_CORREO', 'RECUPERAR_PASSWORD');

-- CreateEnum
CREATE TYPE "CanalNotificacion" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'WEB');

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "codigo" VARCHAR(45) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "permiso" (
    "id_permiso" SERIAL NOT NULL,
    "codigo" VARCHAR(100) NOT NULL,
    "recurso" VARCHAR(80) NOT NULL,
    "accion" VARCHAR(80) NOT NULL,
    "descripcion" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("id_permiso")
);

-- CreateTable
CREATE TABLE "rol_permiso" (
    "id_rol_permiso" SERIAL NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "id_permiso" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "rol_permiso_pkey" PRIMARY KEY ("id_rol_permiso")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_completo" VARCHAR(150) NOT NULL,
    "correo" VARCHAR(254) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "telefono" VARCHAR(25),
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "correo_verificado_at" TIMESTAMPTZ(3),
    "ultimo_acceso" TIMESTAMPTZ(3),
    "bloqueo_hasta" TIMESTAMPTZ(3),
    "password_changed_at" TIMESTAMPTZ(3),
    "version_seguridad" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "usuario_rol" (
    "id_usuario_rol" SERIAL NOT NULL,
    "asignado_por" INTEGER,
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "usuario_rol_pkey" PRIMARY KEY ("id_usuario_rol")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id_cliente" SERIAL NOT NULL,
    "nombre_facturacion" VARCHAR(200),
    "identificacion_fiscal" VARCHAR(30),
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id_cliente")
);

-- CreateTable
CREATE TABLE "empleado" (
    "id_empleado" SERIAL NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "cargo" VARCHAR(100) NOT NULL,
    "fecha_contratacion" DATE NOT NULL,
    "fecha_baja" DATE,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "empleado_pkey" PRIMARY KEY ("id_empleado")
);

-- CreateTable
CREATE TABLE "empleado_sucursal" (
    "id_empleado_sucursal" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "desde" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasta" TIMESTAMPTZ(3),
    "id_empleado" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "empleado_sucursal_pkey" PRIMARY KEY ("id_empleado_sucursal")
);

-- CreateTable
CREATE TABLE "direccion_cliente" (
    "id_direccion_cliente" SERIAL NOT NULL,
    "alias" VARCHAR(60) NOT NULL,
    "destinatario" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(25) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "zona" VARCHAR(20),
    "direccion" VARCHAR(500) NOT NULL,
    "referencias" TEXT,
    "latitud" DECIMAL(10,7),
    "longitud" DECIMAL(10,7),
    "predeterminada" BOOLEAN NOT NULL DEFAULT false,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "id_cliente" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "direccion_cliente_pkey" PRIMARY KEY ("id_direccion_cliente")
);

-- CreateTable
CREATE TABLE "sesion" (
    "id_sesion" SERIAL NOT NULL,
    "refresh_token_hash" VARCHAR(128) NOT NULL,
    "familia" UUID NOT NULL,
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "revocada_at" TIMESTAMPTZ(3),
    "ultimo_uso" TIMESTAMPTZ(3),
    "dispositivo" VARCHAR(150),
    "ip_origen" INET,
    "user_agent" TEXT,
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sesion_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "token_accion" (
    "id_token_accion" SERIAL NOT NULL,
    "tipo" "TipoToken" NOT NULL,
    "token_hash" VARCHAR(128) NOT NULL,
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "consumido_at" TIMESTAMPTZ(3),
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "token_accion_pkey" PRIMARY KEY ("id_token_accion")
);

-- CreateTable
CREATE TABLE "factor_mfa" (
    "id_factor_mfa" SERIAL NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "secreto_cifrado" TEXT,
    "credencial_publica" TEXT,
    "habilitado_at" TIMESTAMPTZ(3),
    "revocado_at" TIMESTAMPTZ(3),
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "factor_mfa_pkey" PRIMARY KEY ("id_factor_mfa")
);

-- CreateTable
CREATE TABLE "codigo_recuperacion_mfa" (
    "id_codigo_recuperacion_mfa" SERIAL NOT NULL,
    "codigo_hash" VARCHAR(128) NOT NULL,
    "consumido_at" TIMESTAMPTZ(3),
    "id_factor_mfa" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "codigo_recuperacion_mfa_pkey" PRIMARY KEY ("id_codigo_recuperacion_mfa")
);

-- CreateTable
CREATE TABLE "consentimiento" (
    "id_consentimiento" SERIAL NOT NULL,
    "finalidad" VARCHAR(80) NOT NULL,
    "documento" VARCHAR(150) NOT NULL,
    "version_documento" VARCHAR(30) NOT NULL,
    "otorgado_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revocado_at" TIMESTAMPTZ(3),
    "canal" VARCHAR(30) NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "consentimiento_pkey" PRIMARY KEY ("id_consentimiento")
);

-- CreateTable
CREATE TABLE "preferencia_notificacion" (
    "id_preferencia_notificacion" SERIAL NOT NULL,
    "evento" VARCHAR(100) NOT NULL,
    "canal" "CanalNotificacion" NOT NULL,
    "habilitada" BOOLEAN NOT NULL DEFAULT false,
    "id_usuario" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "preferencia_notificacion_pkey" PRIMARY KEY ("id_preferencia_notificacion")
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
CREATE UNIQUE INDEX "rol_codigo_key" ON "rol"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "permiso_codigo_key" ON "permiso"("codigo");

-- CreateIndex
CREATE INDEX "rol_permiso_id_rol_idx" ON "rol_permiso"("id_rol");

-- CreateIndex
CREATE INDEX "rol_permiso_id_permiso_idx" ON "rol_permiso"("id_permiso");

-- CreateIndex
CREATE UNIQUE INDEX "rol_permiso_id_rol_id_permiso_key" ON "rol_permiso"("id_rol", "id_permiso");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE INDEX "usuario_estado_idx" ON "usuario"("estado");

-- CreateIndex
CREATE INDEX "usuario_rol_id_usuario_idx" ON "usuario_rol"("id_usuario");

-- CreateIndex
CREATE INDEX "usuario_rol_id_rol_idx" ON "usuario_rol"("id_rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_rol_id_usuario_id_rol_key" ON "usuario_rol"("id_usuario", "id_rol");

-- CreateIndex
CREATE INDEX "cliente_id_usuario_idx" ON "cliente"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_id_usuario_key" ON "cliente"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_codigo_key" ON "empleado"("codigo");

-- CreateIndex
CREATE INDEX "empleado_id_usuario_idx" ON "empleado"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_id_usuario_key" ON "empleado"("id_usuario");

-- CreateIndex
CREATE INDEX "empleado_sucursal_id_sucursal_idx" ON "empleado_sucursal"("id_sucursal");

-- CreateIndex
CREATE INDEX "empleado_sucursal_id_empleado_idx" ON "empleado_sucursal"("id_empleado");

-- CreateIndex
CREATE UNIQUE INDEX "empleado_sucursal_id_empleado_id_sucursal_key" ON "empleado_sucursal"("id_empleado", "id_sucursal");

-- CreateIndex
CREATE INDEX "direccion_cliente_id_cliente_idx" ON "direccion_cliente"("id_cliente");

-- CreateIndex
CREATE UNIQUE INDEX "sesion_refresh_token_hash_key" ON "sesion"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "sesion_familia_idx" ON "sesion"("familia");

-- CreateIndex
CREATE INDEX "sesion_vence_at_idx" ON "sesion"("vence_at");

-- CreateIndex
CREATE INDEX "sesion_id_usuario_idx" ON "sesion"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "token_accion_token_hash_key" ON "token_accion"("token_hash");

-- CreateIndex
CREATE INDEX "token_accion_vence_at_idx" ON "token_accion"("vence_at");

-- CreateIndex
CREATE INDEX "token_accion_id_usuario_idx" ON "token_accion"("id_usuario");

-- CreateIndex
CREATE INDEX "factor_mfa_id_usuario_idx" ON "factor_mfa"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "codigo_recuperacion_mfa_codigo_hash_key" ON "codigo_recuperacion_mfa"("codigo_hash");

-- CreateIndex
CREATE INDEX "codigo_recuperacion_mfa_id_factor_mfa_idx" ON "codigo_recuperacion_mfa"("id_factor_mfa");

-- CreateIndex
CREATE INDEX "consentimiento_id_usuario_idx" ON "consentimiento"("id_usuario");

-- CreateIndex
CREATE INDEX "preferencia_notificacion_id_usuario_idx" ON "preferencia_notificacion"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "preferencia_notificacion_id_usuario_evento_canal_key" ON "preferencia_notificacion"("id_usuario", "evento", "canal");

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
ALTER TABLE "rol_permiso" ADD CONSTRAINT "rol_permiso_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permiso" ADD CONSTRAINT "rol_permiso_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "permiso"("id_permiso") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_rol" ADD CONSTRAINT "usuario_rol_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleado" ADD CONSTRAINT "empleado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empleado_sucursal" ADD CONSTRAINT "empleado_sucursal_id_empleado_fkey" FOREIGN KEY ("id_empleado") REFERENCES "empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direccion_cliente" ADD CONSTRAINT "direccion_cliente_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "cliente"("id_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesion" ADD CONSTRAINT "sesion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "token_accion" ADD CONSTRAINT "token_accion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factor_mfa" ADD CONSTRAINT "factor_mfa_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "codigo_recuperacion_mfa" ADD CONSTRAINT "codigo_recuperacion_mfa_id_factor_mfa_fkey" FOREIGN KEY ("id_factor_mfa") REFERENCES "factor_mfa"("id_factor_mfa") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consentimiento" ADD CONSTRAINT "consentimiento_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preferencia_notificacion" ADD CONSTRAINT "preferencia_notificacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "entrega_notificacion_id_notificacion_fkey" FOREIGN KEY ("id_notificacion") REFERENCES "notificacion"("id_notificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- INVARIANTES V05
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
