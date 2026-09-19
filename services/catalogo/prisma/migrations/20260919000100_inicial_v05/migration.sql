-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "EstadoRegistro" AS ENUM ('ACTIVO', 'INACTIVO');

-- CreateEnum
CREATE TYPE "EstadoPublicacion" AS ENUM ('BORRADOR', 'PUBLICADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('MEDICAMENTO', 'CUIDADO_PERSONAL', 'DISPOSITIVO', 'SUPLEMENTO', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoPresentacion" AS ENUM ('UNIDAD', 'BLISTER', 'CAJA', 'FRASCO', 'TUBO', 'SOBRE', 'PAQUETE', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoPromocion" AS ENUM ('PORCENTAJE', 'MONTO', 'PRECIO_FIJO', 'COMBO');

-- CreateEnum
CREATE TYPE "EstadoUsoPromocion" AS ENUM ('RESERVADO', 'CONFIRMADO', 'LIBERADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "TipoPagina" AS ENUM ('QUIENES_SOMOS', 'POLITICA', 'AYUDA', 'BLOG', 'EMPRESAS');

-- CreateEnum
CREATE TYPE "TipoContacto" AS ENUM ('TELEFONO', 'WHATSAPP', 'CORREO', 'RED_SOCIAL');

-- CreateTable
CREATE TABLE "marca" (
    "id_marca" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "descripcion" TEXT,
    "imagen_clave" TEXT,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "marca_pkey" PRIMARY KEY ("id_marca")
);

-- CreateTable
CREATE TABLE "laboratorio" (
    "id_laboratorio" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "descripcion" TEXT,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "laboratorio_pkey" PRIMARY KEY ("id_laboratorio")
);

-- CreateTable
CREATE TABLE "producto" (
    "id_producto" SERIAL NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "slug" VARCHAR(220) NOT NULL,
    "descripcion_corta" VARCHAR(500),
    "descripcion_larga" TEXT,
    "tipo" "TipoProducto" NOT NULL,
    "requiere_receta" BOOLEAN NOT NULL DEFAULT false,
    "registro_sanitario" VARCHAR(100),
    "conservacion" TEXT,
    "advertencias" TEXT,
    "estado" "EstadoPublicacion" NOT NULL DEFAULT 'BORRADOR',
    "visible_web" BOOLEAN NOT NULL DEFAULT false,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "unidad_base" VARCHAR(30) NOT NULL,
    "id_marca" INTEGER,
    "id_laboratorio" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("id_producto")
);

-- CreateTable
CREATE TABLE "presentacion_producto" (
    "id_presentacion_producto" SERIAL NOT NULL,
    "sku" VARCHAR(60) NOT NULL,
    "codigo_barras" VARCHAR(60),
    "nombre" VARCHAR(150) NOT NULL,
    "tipo" "TipoPresentacion" NOT NULL,
    "unidades_base" INTEGER NOT NULL,
    "contenido" DECIMAL(12,4),
    "unidad_contenido" VARCHAR(30),
    "forma_farmaceutica" VARCHAR(100),
    "concentracion_descriptiva" VARCHAR(100),
    "permite_venta" BOOLEAN NOT NULL DEFAULT true,
    "permite_fraccionamiento" BOOLEAN NOT NULL DEFAULT false,
    "peso_gramos" DECIMAL(12,3),
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "id_producto" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "presentacion_producto_pkey" PRIMARY KEY ("id_presentacion_producto")
);

-- CreateTable
CREATE TABLE "conversion_presentacion" (
    "id_conversion_presentacion" SERIAL NOT NULL,
    "cantidad_destino" INTEGER NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "id_origen" INTEGER NOT NULL,
    "id_destino" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "conversion_presentacion_pkey" PRIMARY KEY ("id_conversion_presentacion")
);

-- CreateTable
CREATE TABLE "principio_activo" (
    "id_principio_activo" SERIAL NOT NULL,
    "nombre" VARCHAR(180) NOT NULL,
    "sinonimos" TEXT[],
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "principio_activo_pkey" PRIMARY KEY ("id_principio_activo")
);

-- CreateTable
CREATE TABLE "producto_componente" (
    "id_producto_componente" SERIAL NOT NULL,
    "cantidad" DECIMAL(12,4),
    "unidad" VARCHAR(30),
    "denominador" DECIMAL(12,4),
    "unidad_denominador" VARCHAR(30),
    "id_presentacion" INTEGER NOT NULL,
    "id_principio" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "producto_componente_pkey" PRIMARY KEY ("id_producto_componente")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id_categoria" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "imagen_clave" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "id_padre" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "producto_categoria" (
    "id_producto_categoria" SERIAL NOT NULL,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "id_producto" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "producto_categoria_pkey" PRIMARY KEY ("id_producto_categoria")
);

-- CreateTable
CREATE TABLE "producto_imagen" (
    "id_producto_imagen" SERIAL NOT NULL,
    "clave_archivo" TEXT NOT NULL,
    "texto_alternativo" VARCHAR(250) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "principal" BOOLEAN NOT NULL DEFAULT false,
    "mime" VARCHAR(100) NOT NULL,
    "ancho" INTEGER,
    "alto" INTEGER,
    "id_producto" INTEGER NOT NULL,
    "id_presentacion" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "producto_imagen_pkey" PRIMARY KEY ("id_producto_imagen")
);

-- CreateTable
CREATE TABLE "etiqueta" (
    "id_etiqueta" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "etiqueta_pkey" PRIMARY KEY ("id_etiqueta")
);

-- CreateTable
CREATE TABLE "producto_etiqueta" (
    "id_producto_etiqueta" SERIAL NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "id_etiqueta" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "producto_etiqueta_pkey" PRIMARY KEY ("id_producto_etiqueta")
);

-- CreateTable
CREATE TABLE "atributo" (
    "id_atributo" SERIAL NOT NULL,
    "codigo" VARCHAR(60) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "atributo_pkey" PRIMARY KEY ("id_atributo")
);

-- CreateTable
CREATE TABLE "valor_atributo" (
    "id_valor_atributo" SERIAL NOT NULL,
    "valor" VARCHAR(250) NOT NULL,
    "id_atributo" INTEGER NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "valor_atributo_pkey" PRIMARY KEY ("id_valor_atributo")
);

-- CreateTable
CREATE TABLE "producto_relacionado" (
    "id_producto_relacionado" SERIAL NOT NULL,
    "tipo" VARCHAR(40) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "revisado_por" INTEGER,
    "id_origen" INTEGER NOT NULL,
    "id_destino" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "producto_relacionado_pkey" PRIMARY KEY ("id_producto_relacionado")
);

-- CreateTable
CREATE TABLE "documento_producto" (
    "id_documento_producto" SERIAL NOT NULL,
    "tipo" VARCHAR(60) NOT NULL,
    "clave_archivo" TEXT NOT NULL,
    "titulo" VARCHAR(180) NOT NULL,
    "version" VARCHAR(30) NOT NULL,
    "publicado_at" TIMESTAMPTZ(3),
    "id_producto" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "documento_producto_pkey" PRIMARY KEY ("id_documento_producto")
);

-- CreateTable
CREATE TABLE "lista_precio" (
    "id_lista_precio" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'GTQ',
    "estado" "EstadoRegistro" NOT NULL DEFAULT 'ACTIVO',
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "lista_precio_pkey" PRIMARY KEY ("id_lista_precio")
);

-- CreateTable
CREATE TABLE "precio_presentacion" (
    "id_precio_presentacion" SERIAL NOT NULL,
    "importe" DECIMAL(14,2) NOT NULL,
    "incluye_impuesto" BOOLEAN NOT NULL DEFAULT true,
    "tasa_impuesto" DECIMAL(7,4) NOT NULL,
    "id_sucursal" INTEGER,
    "canal" VARCHAR(30) NOT NULL DEFAULT 'TODOS',
    "desde" TIMESTAMPTZ(3) NOT NULL,
    "hasta" TIMESTAMPTZ(3),
    "id_lista" INTEGER NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "precio_presentacion_pkey" PRIMARY KEY ("id_precio_presentacion")
);

-- CreateTable
CREATE TABLE "sinonimo_busqueda" (
    "id_sinonimo_busqueda" SERIAL NOT NULL,
    "termino" VARCHAR(150) NOT NULL,
    "sinonimo" VARCHAR(150) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "sinonimo_busqueda_pkey" PRIMARY KEY ("id_sinonimo_busqueda")
);

-- CreateTable
CREATE TABLE "promocion" (
    "id_promocion" SERIAL NOT NULL,
    "codigo" VARCHAR(60) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT,
    "tipo" "TipoPromocion" NOT NULL,
    "valor" DECIMAL(14,2),
    "desde" TIMESTAMPTZ(3) NOT NULL,
    "hasta" TIMESTAMPTZ(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT false,
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "acumulable" BOOLEAN NOT NULL DEFAULT false,
    "minimo_compra" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "tope_descuento" DECIMAL(14,2),
    "limite_global" INTEGER,
    "limite_cliente" INTEGER,
    "canales" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promocion_pkey" PRIMARY KEY ("id_promocion")
);

-- CreateTable
CREATE TABLE "promocion_producto" (
    "id_promocion_producto" SERIAL NOT NULL,
    "id_promocion" INTEGER NOT NULL,
    "id_producto" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promocion_producto_pkey" PRIMARY KEY ("id_promocion_producto")
);

-- CreateTable
CREATE TABLE "promocion_categoria" (
    "id_promocion_categoria" SERIAL NOT NULL,
    "id_promocion" INTEGER NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promocion_categoria_pkey" PRIMARY KEY ("id_promocion_categoria")
);

-- CreateTable
CREATE TABLE "promocion_sucursal" (
    "id_promocion_sucursal" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "id_promocion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promocion_sucursal_pkey" PRIMARY KEY ("id_promocion_sucursal")
);

-- CreateTable
CREATE TABLE "promocion_combo_detalle" (
    "id_promocion_combo_detalle" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "bonificada" BOOLEAN NOT NULL DEFAULT false,
    "id_promocion" INTEGER NOT NULL,
    "id_presentacion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "promocion_combo_detalle_pkey" PRIMARY KEY ("id_promocion_combo_detalle")
);

-- CreateTable
CREATE TABLE "cupon" (
    "id_cupon" SERIAL NOT NULL,
    "codigo" VARCHAR(60) NOT NULL,
    "desde" TIMESTAMPTZ(3) NOT NULL,
    "hasta" TIMESTAMPTZ(3) NOT NULL,
    "limite_usos" INTEGER,
    "id_cliente" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "id_promocion" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "cupon_pkey" PRIMARY KEY ("id_cupon")
);

-- CreateTable
CREATE TABLE "uso_promocion" (
    "id_uso_promocion" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_cliente" INTEGER,
    "clave_idempotencia" VARCHAR(100) NOT NULL,
    "estado" "EstadoUsoPromocion" NOT NULL DEFAULT 'RESERVADO',
    "vence_at" TIMESTAMPTZ(3) NOT NULL,
    "monto" DECIMAL(14,2) NOT NULL,
    "id_promocion" INTEGER NOT NULL,
    "id_cupon" INTEGER,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "uso_promocion_pkey" PRIMARY KEY ("id_uso_promocion")
);

-- CreateTable
CREATE TABLE "programa_beneficio" (
    "id_programa_beneficio" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "condiciones" TEXT NOT NULL,
    "desde" TIMESTAMPTZ(3),
    "hasta" TIMESTAMPTZ(3),
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "programa_beneficio_pkey" PRIMARY KEY ("id_programa_beneficio")
);

-- CreateTable
CREATE TABLE "aseguradora" (
    "id_aseguradora" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "logo_clave" TEXT,
    "contacto" TEXT,
    "telefono" VARCHAR(25),
    "sitio_web" TEXT,
    "instrucciones_publicas" TEXT,
    "activa" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "aseguradora_pkey" PRIMARY KEY ("id_aseguradora")
);

-- CreateTable
CREATE TABLE "convenio_seguro_publico" (
    "id_convenio_seguro_publico" SERIAL NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "condiciones" TEXT NOT NULL,
    "requisitos" TEXT,
    "desde" DATE,
    "hasta" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "id_aseguradora" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "convenio_seguro_publico_pkey" PRIMARY KEY ("id_convenio_seguro_publico")
);

-- CreateTable
CREATE TABLE "seguro_sucursal" (
    "id_seguro_sucursal" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "id_convenio" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "seguro_sucursal_pkey" PRIMARY KEY ("id_seguro_sucursal")
);

-- CreateTable
CREATE TABLE "pagina_contenido" (
    "id_pagina_contenido" SERIAL NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "tipo" "TipoPagina" NOT NULL,
    "estado" "EstadoPublicacion" NOT NULL DEFAULT 'BORRADOR',
    "titulo_seo" VARCHAR(200),
    "descripcion_seo" VARCHAR(350),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pagina_contenido_pkey" PRIMARY KEY ("id_pagina_contenido")
);

-- CreateTable
CREATE TABLE "version_pagina" (
    "id_version_pagina" SERIAL NOT NULL,
    "numero" INTEGER NOT NULL,
    "contenido" TEXT NOT NULL,
    "id_autor" INTEGER NOT NULL,
    "publicada_at" TIMESTAMPTZ(3),
    "id_pagina" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "version_pagina_pkey" PRIMARY KEY ("id_version_pagina")
);

-- CreateTable
CREATE TABLE "banner" (
    "id_banner" SERIAL NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "imagen_escritorio" TEXT NOT NULL,
    "imagen_movil" TEXT,
    "texto_alternativo" VARCHAR(250) NOT NULL,
    "enlace" TEXT,
    "ubicacion" VARCHAR(60) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "desde" TIMESTAMPTZ(3),
    "hasta" TIMESTAMPTZ(3),
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id_banner")
);

-- CreateTable
CREATE TABLE "pregunta_frecuente" (
    "id_pregunta_frecuente" SERIAL NOT NULL,
    "categoria" VARCHAR(80) NOT NULL,
    "pregunta" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "pregunta_frecuente_pkey" PRIMARY KEY ("id_pregunta_frecuente")
);

-- CreateTable
CREATE TABLE "canal_contacto" (
    "id_canal_contacto" SERIAL NOT NULL,
    "tipo" "TipoContacto" NOT NULL,
    "valor" TEXT NOT NULL,
    "horario_texto" TEXT,
    "id_sucursal" INTEGER,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "canal_contacto_pkey" PRIMARY KEY ("id_canal_contacto")
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
CREATE UNIQUE INDEX "marca_nombre_key" ON "marca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marca_slug_key" ON "marca"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "laboratorio_nombre_key" ON "laboratorio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "laboratorio_slug_key" ON "laboratorio"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "producto_slug_key" ON "producto"("slug");

-- CreateIndex
CREATE INDEX "producto_nombre_idx" ON "producto"("nombre");

-- CreateIndex
CREATE INDEX "producto_estado_visible_web_idx" ON "producto"("estado", "visible_web");

-- CreateIndex
CREATE INDEX "producto_id_marca_idx" ON "producto"("id_marca");

-- CreateIndex
CREATE INDEX "producto_id_laboratorio_idx" ON "producto"("id_laboratorio");

-- CreateIndex
CREATE UNIQUE INDEX "presentacion_producto_sku_key" ON "presentacion_producto"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "presentacion_producto_codigo_barras_key" ON "presentacion_producto"("codigo_barras");

-- CreateIndex
CREATE INDEX "presentacion_producto_id_producto_idx" ON "presentacion_producto"("id_producto");

-- CreateIndex
CREATE INDEX "conversion_presentacion_id_origen_idx" ON "conversion_presentacion"("id_origen");

-- CreateIndex
CREATE INDEX "conversion_presentacion_id_destino_idx" ON "conversion_presentacion"("id_destino");

-- CreateIndex
CREATE UNIQUE INDEX "conversion_presentacion_id_origen_id_destino_version_key" ON "conversion_presentacion"("id_origen", "id_destino", "version");

-- CreateIndex
CREATE UNIQUE INDEX "principio_activo_nombre_key" ON "principio_activo"("nombre");

-- CreateIndex
CREATE INDEX "producto_componente_id_presentacion_idx" ON "producto_componente"("id_presentacion");

-- CreateIndex
CREATE INDEX "producto_componente_id_principio_idx" ON "producto_componente"("id_principio");

-- CreateIndex
CREATE UNIQUE INDEX "producto_componente_id_presentacion_id_principio_key" ON "producto_componente"("id_presentacion", "id_principio");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_slug_key" ON "categoria"("slug");

-- CreateIndex
CREATE INDEX "categoria_id_padre_idx" ON "categoria"("id_padre");

-- CreateIndex
CREATE INDEX "producto_categoria_id_producto_idx" ON "producto_categoria"("id_producto");

-- CreateIndex
CREATE INDEX "producto_categoria_id_categoria_idx" ON "producto_categoria"("id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "producto_categoria_id_producto_id_categoria_key" ON "producto_categoria"("id_producto", "id_categoria");

-- CreateIndex
CREATE INDEX "producto_imagen_id_producto_idx" ON "producto_imagen"("id_producto");

-- CreateIndex
CREATE INDEX "producto_imagen_id_presentacion_idx" ON "producto_imagen"("id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "etiqueta_nombre_key" ON "etiqueta"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "etiqueta_slug_key" ON "etiqueta"("slug");

-- CreateIndex
CREATE INDEX "producto_etiqueta_id_producto_idx" ON "producto_etiqueta"("id_producto");

-- CreateIndex
CREATE INDEX "producto_etiqueta_id_etiqueta_idx" ON "producto_etiqueta"("id_etiqueta");

-- CreateIndex
CREATE UNIQUE INDEX "producto_etiqueta_id_producto_id_etiqueta_key" ON "producto_etiqueta"("id_producto", "id_etiqueta");

-- CreateIndex
CREATE UNIQUE INDEX "atributo_codigo_key" ON "atributo"("codigo");

-- CreateIndex
CREATE INDEX "valor_atributo_id_atributo_idx" ON "valor_atributo"("id_atributo");

-- CreateIndex
CREATE INDEX "valor_atributo_id_presentacion_idx" ON "valor_atributo"("id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "valor_atributo_id_atributo_id_presentacion_key" ON "valor_atributo"("id_atributo", "id_presentacion");

-- CreateIndex
CREATE INDEX "producto_relacionado_id_origen_idx" ON "producto_relacionado"("id_origen");

-- CreateIndex
CREATE INDEX "producto_relacionado_id_destino_idx" ON "producto_relacionado"("id_destino");

-- CreateIndex
CREATE UNIQUE INDEX "producto_relacionado_id_origen_id_destino_tipo_key" ON "producto_relacionado"("id_origen", "id_destino", "tipo");

-- CreateIndex
CREATE INDEX "documento_producto_id_producto_idx" ON "documento_producto"("id_producto");

-- CreateIndex
CREATE UNIQUE INDEX "lista_precio_codigo_key" ON "lista_precio"("codigo");

-- CreateIndex
CREATE INDEX "precio_presentacion_id_presentacion_id_lista_desde_idx" ON "precio_presentacion"("id_presentacion", "id_lista", "desde");

-- CreateIndex
CREATE INDEX "precio_presentacion_id_lista_idx" ON "precio_presentacion"("id_lista");

-- CreateIndex
CREATE INDEX "precio_presentacion_id_presentacion_idx" ON "precio_presentacion"("id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "sinonimo_busqueda_termino_sinonimo_key" ON "sinonimo_busqueda"("termino", "sinonimo");

-- CreateIndex
CREATE UNIQUE INDEX "promocion_codigo_key" ON "promocion"("codigo");

-- CreateIndex
CREATE INDEX "promocion_activa_desde_hasta_idx" ON "promocion"("activa", "desde", "hasta");

-- CreateIndex
CREATE INDEX "promocion_producto_id_promocion_idx" ON "promocion_producto"("id_promocion");

-- CreateIndex
CREATE INDEX "promocion_producto_id_producto_idx" ON "promocion_producto"("id_producto");

-- CreateIndex
CREATE UNIQUE INDEX "promocion_producto_id_promocion_id_producto_key" ON "promocion_producto"("id_promocion", "id_producto");

-- CreateIndex
CREATE INDEX "promocion_categoria_id_promocion_idx" ON "promocion_categoria"("id_promocion");

-- CreateIndex
CREATE INDEX "promocion_categoria_id_categoria_idx" ON "promocion_categoria"("id_categoria");

-- CreateIndex
CREATE UNIQUE INDEX "promocion_categoria_id_promocion_id_categoria_key" ON "promocion_categoria"("id_promocion", "id_categoria");

-- CreateIndex
CREATE INDEX "promocion_sucursal_id_promocion_idx" ON "promocion_sucursal"("id_promocion");

-- CreateIndex
CREATE UNIQUE INDEX "promocion_sucursal_id_promocion_id_sucursal_key" ON "promocion_sucursal"("id_promocion", "id_sucursal");

-- CreateIndex
CREATE INDEX "promocion_combo_detalle_id_promocion_idx" ON "promocion_combo_detalle"("id_promocion");

-- CreateIndex
CREATE INDEX "promocion_combo_detalle_id_presentacion_idx" ON "promocion_combo_detalle"("id_presentacion");

-- CreateIndex
CREATE UNIQUE INDEX "promocion_combo_detalle_id_promocion_id_presentacion_bonifi_key" ON "promocion_combo_detalle"("id_promocion", "id_presentacion", "bonificada");

-- CreateIndex
CREATE UNIQUE INDEX "cupon_codigo_key" ON "cupon"("codigo");

-- CreateIndex
CREATE INDEX "cupon_id_promocion_idx" ON "cupon"("id_promocion");

-- CreateIndex
CREATE UNIQUE INDEX "uso_promocion_clave_idempotencia_key" ON "uso_promocion"("clave_idempotencia");

-- CreateIndex
CREATE INDEX "uso_promocion_id_cliente_idx" ON "uso_promocion"("id_cliente");

-- CreateIndex
CREATE INDEX "uso_promocion_id_pedido_idx" ON "uso_promocion"("id_pedido");

-- CreateIndex
CREATE INDEX "uso_promocion_estado_vence_at_idx" ON "uso_promocion"("estado", "vence_at");

-- CreateIndex
CREATE INDEX "uso_promocion_id_promocion_idx" ON "uso_promocion"("id_promocion");

-- CreateIndex
CREATE INDEX "uso_promocion_id_cupon_idx" ON "uso_promocion"("id_cupon");

-- CreateIndex
CREATE UNIQUE INDEX "programa_beneficio_codigo_key" ON "programa_beneficio"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "aseguradora_nombre_key" ON "aseguradora"("nombre");

-- CreateIndex
CREATE INDEX "convenio_seguro_publico_id_aseguradora_idx" ON "convenio_seguro_publico"("id_aseguradora");

-- CreateIndex
CREATE INDEX "seguro_sucursal_id_convenio_idx" ON "seguro_sucursal"("id_convenio");

-- CreateIndex
CREATE UNIQUE INDEX "seguro_sucursal_id_convenio_id_sucursal_key" ON "seguro_sucursal"("id_convenio", "id_sucursal");

-- CreateIndex
CREATE UNIQUE INDEX "pagina_contenido_slug_key" ON "pagina_contenido"("slug");

-- CreateIndex
CREATE INDEX "version_pagina_id_pagina_idx" ON "version_pagina"("id_pagina");

-- CreateIndex
CREATE UNIQUE INDEX "version_pagina_id_pagina_numero_key" ON "version_pagina"("id_pagina", "numero");

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
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_marca_fkey" FOREIGN KEY ("id_marca") REFERENCES "marca"("id_marca") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_id_laboratorio_fkey" FOREIGN KEY ("id_laboratorio") REFERENCES "laboratorio"("id_laboratorio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presentacion_producto" ADD CONSTRAINT "presentacion_producto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_presentacion" ADD CONSTRAINT "conversion_presentacion_id_origen_fkey" FOREIGN KEY ("id_origen") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversion_presentacion" ADD CONSTRAINT "conversion_presentacion_id_destino_fkey" FOREIGN KEY ("id_destino") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_componente" ADD CONSTRAINT "producto_componente_id_presentacion_fkey" FOREIGN KEY ("id_presentacion") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_componente" ADD CONSTRAINT "producto_componente_id_principio_fkey" FOREIGN KEY ("id_principio") REFERENCES "principio_activo"("id_principio_activo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categoria" ADD CONSTRAINT "categoria_id_padre_fkey" FOREIGN KEY ("id_padre") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_categoria" ADD CONSTRAINT "producto_categoria_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_categoria" ADD CONSTRAINT "producto_categoria_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_imagen" ADD CONSTRAINT "producto_imagen_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_imagen" ADD CONSTRAINT "producto_imagen_id_presentacion_fkey" FOREIGN KEY ("id_presentacion") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_etiqueta" ADD CONSTRAINT "producto_etiqueta_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_etiqueta" ADD CONSTRAINT "producto_etiqueta_id_etiqueta_fkey" FOREIGN KEY ("id_etiqueta") REFERENCES "etiqueta"("id_etiqueta") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valor_atributo" ADD CONSTRAINT "valor_atributo_id_atributo_fkey" FOREIGN KEY ("id_atributo") REFERENCES "atributo"("id_atributo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valor_atributo" ADD CONSTRAINT "valor_atributo_id_presentacion_fkey" FOREIGN KEY ("id_presentacion") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_relacionado" ADD CONSTRAINT "producto_relacionado_id_origen_fkey" FOREIGN KEY ("id_origen") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_relacionado" ADD CONSTRAINT "producto_relacionado_id_destino_fkey" FOREIGN KEY ("id_destino") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documento_producto" ADD CONSTRAINT "documento_producto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precio_presentacion" ADD CONSTRAINT "precio_presentacion_id_lista_fkey" FOREIGN KEY ("id_lista") REFERENCES "lista_precio"("id_lista_precio") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "precio_presentacion" ADD CONSTRAINT "precio_presentacion_id_presentacion_fkey" FOREIGN KEY ("id_presentacion") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_producto" ADD CONSTRAINT "promocion_producto_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promocion"("id_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_producto" ADD CONSTRAINT "promocion_producto_id_producto_fkey" FOREIGN KEY ("id_producto") REFERENCES "producto"("id_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_categoria" ADD CONSTRAINT "promocion_categoria_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promocion"("id_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_categoria" ADD CONSTRAINT "promocion_categoria_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categoria"("id_categoria") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_sucursal" ADD CONSTRAINT "promocion_sucursal_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promocion"("id_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_combo_detalle" ADD CONSTRAINT "promocion_combo_detalle_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promocion"("id_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promocion_combo_detalle" ADD CONSTRAINT "promocion_combo_detalle_id_presentacion_fkey" FOREIGN KEY ("id_presentacion") REFERENCES "presentacion_producto"("id_presentacion_producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupon" ADD CONSTRAINT "cupon_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promocion"("id_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uso_promocion" ADD CONSTRAINT "uso_promocion_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promocion"("id_promocion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uso_promocion" ADD CONSTRAINT "uso_promocion_id_cupon_fkey" FOREIGN KEY ("id_cupon") REFERENCES "cupon"("id_cupon") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "convenio_seguro_publico" ADD CONSTRAINT "convenio_seguro_publico_id_aseguradora_fkey" FOREIGN KEY ("id_aseguradora") REFERENCES "aseguradora"("id_aseguradora") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguro_sucursal" ADD CONSTRAINT "seguro_sucursal_id_convenio_fkey" FOREIGN KEY ("id_convenio") REFERENCES "convenio_seguro_publico"("id_convenio_seguro_publico") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "version_pagina" ADD CONSTRAINT "version_pagina_id_pagina_fkey" FOREIGN KEY ("id_pagina") REFERENCES "pagina_contenido"("id_pagina_contenido") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrega_notificacion" ADD CONSTRAINT "entrega_notificacion_id_notificacion_fkey" FOREIGN KEY ("id_notificacion") REFERENCES "notificacion"("id_notificacion") ON DELETE RESTRICT ON UPDATE CASCADE;

-- INVARIANTES V05
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
