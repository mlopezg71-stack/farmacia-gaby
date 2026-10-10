import crypto from "crypto";

import prisma from "../config/prisma.js";
import { obtenerProductosCatalogo } from "./catalogoService.js";


// ======================================================
// CONSTANTES
// ======================================================

// Días que dura un carrito ACTIVO antes de pasar a VENCIDO.
// Antes el front tenía que mandar vence_at; ahora lo calcula el backend.
const DIAS_VIGENCIA_CARRITO = 7;

// Canales de precio que aplican a la tienda web.
const CANALES_PRECIO_WEB = ["TODOS", "WEB"];

// Largo mínimo del token que genera el front para el invitado.
const LONGITUD_MINIMA_TOKEN = 16;


// ======================================================
// UTILIDADES INTERNAS
// ======================================================

// Crea un error con código HTTP para que el controller sepa qué responder.
const crearError = (status, message) => {
    const error = new Error(message);

    error.status = status;

    return error;
};

// Redondea a 2 decimales (los importes de Prisma llegan como Decimal/string).
const redondear = (valor) => Math.round(valor * 100) / 100;

// La columna se llama token_invitado_hash, así que en la base NUNCA se guarda
// el token en claro: el front manda el token y aquí se guarda su SHA-256.
export const hashearToken = (token) =>
    crypto.createHash("sha256").update(token).digest("hex");

const calcularVencimiento = () =>
    new Date(Date.now() + DIAS_VIGENCIA_CARRITO * 24 * 60 * 60 * 1000);

const validarIdCarrito = (valor) => {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        throw crearError(400, "ID de carrito inválido");
    }

    return id;
};

// La base tiene el CHECK ck_carrito_1: el carrito pertenece a un cliente
// O a un invitado, nunca a los dos ni a ninguno. Se valida aquí para
// responder 400 claro en lugar de dejar que la base lance un error 500.
const validarIdentidad = ({ id_cliente, token_invitado }) => {
    const tieneCliente =
        id_cliente !== undefined && id_cliente !== null && id_cliente !== "";

    const tieneToken =
        token_invitado !== undefined &&
        token_invitado !== null &&
        token_invitado !== "";

    if (tieneCliente === tieneToken) {
        throw crearError(
            400,
            "Debes enviar id_cliente o token_invitado, pero solo uno de los dos"
        );
    }

    if (tieneCliente) {
        const idCliente = Number(id_cliente);

        if (!Number.isInteger(idCliente) || idCliente <= 0) {
            throw crearError(400, "id_cliente inválido");
        }

        return { id_cliente: idCliente, token_invitado_hash: null };
    }

    if (
        typeof token_invitado !== "string" ||
        token_invitado.length < LONGITUD_MINIMA_TOKEN
    ) {
        throw crearError(
            400,
            `token_invitado debe tener al menos ${LONGITUD_MINIMA_TOKEN} caracteres`
        );
    }

    return {
        id_cliente: null,
        token_invitado_hash: hashearToken(token_invitado),
    };
};

// Busca el carrito ACTIVO de la identidad. La base garantiza (índices
// uq_carrito_activo_cliente y uq_carrito_activo_invitado) que solo hay uno.
const buscarCarritoActivo = (identidad) =>
    prisma.carrito.findFirst({
        where: {
            estado: "ACTIVO",
            ...(identidad.id_cliente !== null
                ? { id_cliente: identidad.id_cliente }
                : { token_invitado_hash: identidad.token_invitado_hash }),
        },
    });

// Si el carrito está ACTIVO pero ya pasó su vence_at, lo marca VENCIDO.
// Esto libera el índice único y permite crear un carrito nuevo.
const marcarVencidoSiCorresponde = async (carrito) => {
    if (carrito.estado !== "ACTIVO" || carrito.vence_at > new Date()) {
        return carrito;
    }

    await prisma.carrito.update({
        where: { id_carrito: carrito.id_carrito },
        data: { estado: "VENCIDO" },
    });

    return { ...carrito, estado: "VENCIDO" };
};


// ======================================================
// CATÁLOGO: PRESENTACIÓN, IMAGEN Y PRECIO VIGENTE
// ======================================================

// Arma un Map id_presentacion -> { producto, presentacion, imagen }
// para no recorrer todo el catálogo por cada item del carrito.
export const construirMapaPresentaciones = (productos) => {
    const mapa = new Map();

    for (const producto of productos) {
        const imagenes = producto.rel_producto_imagen_id_producto || [];
        const imagen = imagenes.find((item) => item.principal) ?? imagenes[0] ?? null;

        for (const presentacion of producto.rel_presentacion_producto_id_producto || []) {
            mapa.set(Number(presentacion.id_presentacion_producto), {
                producto,
                presentacion,
                imagen,
            });
        }
    }

    return mapa;
};

// Elige el precio que hoy aplica: vigente por fecha, de la lista activa,
// del canal web y de la sucursal del carrito (o el general si no hay).
// Antes se tomaba precios[0] sin revisar nada de esto.
export const seleccionarPrecioVigente = (precios = [], id_sucursal) => {
    const ahora = new Date();

    const candidatos = precios.filter((precio) => {
        const desde = new Date(precio.desde);
        const hasta = precio.hasta ? new Date(precio.hasta) : null;

        const sucursalValida =
            precio.id_sucursal === null ||
            precio.id_sucursal === undefined ||
            precio.id_sucursal === id_sucursal;

        return (
            desde <= ahora &&
            (hasta === null || hasta > ahora) &&
            CANALES_PRECIO_WEB.includes(precio.canal) &&
            sucursalValida &&
            precio.ref_id_lista?.estado === "ACTIVO"
        );
    });

    if (candidatos.length === 0) {
        return null;
    }

    // Primero el precio específico de la sucursal, luego el más reciente.
    candidatos.sort((a, b) => {
        const especificoA = a.id_sucursal ? 1 : 0;
        const especificoB = b.id_sucursal ? 1 : 0;

        if (especificoA !== especificoB) {
            return especificoB - especificoA;
        }

        return new Date(b.desde) - new Date(a.desde);
    });

    return candidatos[0];
};


// ======================================================
// ARMAR LA RESPUESTA DEL CARRITO
// ======================================================

const construirLinea = (item, datosCatalogo, id_sucursal) => {
    const precioObservado =
        item.precio_observado !== null && item.precio_observado !== undefined
            ? Number(item.precio_observado)
            : null;

    const base = {
        id_item_carrito: item.id_item_carrito,
        id_presentacion: item.id_presentacion,
        cantidad: item.cantidad,
        precio_observado: precioObservado,
    };

    // La presentación ya no aparece en el catálogo público
    // (se desactivó, se dejó de vender o el producto se despublicó).
    if (!datosCatalogo) {
        return {
            ...base,
            disponible: false,
            motivo_no_disponible: "La presentación ya no está disponible en el catálogo",
            precio_actual: null,
            precio_cambio: false,
            subtotal: 0,
        };
    }

    const { producto, presentacion, imagen } = datosCatalogo;

    const precio = seleccionarPrecioVigente(
        presentacion.rel_precio_presentacion_id_presentacion,
        id_sucursal
    );

    const datosProducto = {
        id_producto: producto.id_producto,
        nombre_producto: producto.nombre,
        slug: producto.slug,
        presentacion: presentacion.nombre,
        sku: presentacion.sku,
        requiere_receta: producto.requiere_receta,
        imagen: imagen
            ? {
                clave_archivo: imagen.clave_archivo,
                texto_alternativo: imagen.texto_alternativo,
            }
            : null,
    };

    if (!precio) {
        return {
            ...base,
            ...datosProducto,
            disponible: false,
            motivo_no_disponible: "La presentación no tiene un precio vigente",
            precio_actual: null,
            precio_cambio: false,
            subtotal: 0,
        };
    }

    const precioActual = Number(precio.importe);

    return {
        ...base,
        ...datosProducto,
        disponible: true,
        motivo_no_disponible: null,
        precio_actual: precioActual,
        // true si el precio cambió desde que el cliente agregó el producto
        precio_cambio: precioObservado !== null && precioObservado !== precioActual,
        subtotal: redondear(precioActual * item.cantidad),
    };
};

const construirResumen = (lineas) => {
    const disponibles = lineas.filter((linea) => linea.disponible);

    return {
        cantidad_lineas: lineas.length,
        cantidad_unidades: lineas.reduce((suma, linea) => suma + linea.cantidad, 0),
        // Solo suman las líneas disponibles; el descuento, el impuesto y el
        // envío se calculan hasta que se crea el pedido.
        subtotal: redondear(disponibles.reduce((suma, linea) => suma + linea.subtotal, 0)),
        hay_items_no_disponibles: disponibles.length !== lineas.length,
        hay_cambios_de_precio: lineas.some((linea) => linea.precio_cambio),
        requiere_receta: lineas.some((linea) => linea.requiere_receta === true),
    };
};


// ======================================================
// SERVICIOS PÚBLICOS DEL CARRITO
// ======================================================

// Devuelve el carrito ACTIVO de la identidad o crea uno nuevo.
// El front llama esto al entrar a la tienda: no necesita saber si ya había carrito.
export const crearOObtenerCarritoActivo = async (datos) => {
    const identidad = validarIdentidad(datos);

    const { moneda, id_sucursal } = datos;

    if (moneda !== undefined && moneda !== null && !/^[A-Z]{3}$/.test(moneda)) {
        throw crearError(400, "moneda debe ser un código de 3 letras, por ejemplo GTQ");
    }

    let idSucursal = null;

    if (id_sucursal !== undefined && id_sucursal !== null && id_sucursal !== "") {
        idSucursal = Number(id_sucursal);

        if (!Number.isInteger(idSucursal) || idSucursal <= 0) {
            throw crearError(400, "id_sucursal inválido");
        }
    }

    const existente = await buscarCarritoActivo(identidad);

    if (existente) {
        const carrito = await marcarVencidoSiCorresponde(existente);

        if (carrito.estado === "ACTIVO") {
            return { carrito, creado: false };
        }
    }

    try {
        const carrito = await prisma.carrito.create({
            data: {
                ...identidad,
                moneda: moneda ?? "GTQ",
                id_sucursal: idSucursal,
                vence_at: calcularVencimiento(),
            },
        });

        return { carrito, creado: true };
    } catch (error) {
        // Si dos peticiones llegan a la vez, el índice único de la base deja
        // pasar solo una. La otra recupera el carrito que ganó.
        const ganador = await buscarCarritoActivo(identidad);

        if (ganador) {
            return { carrito: ganador, creado: false };
        }

        throw error;
    }
};

// Devuelve el carrito ACTIVO de la identidad, sin crearlo.
export const obtenerCarritoActivo = async (datos) => {
    const identidad = validarIdentidad(datos);

    const existente = await buscarCarritoActivo(identidad);

    if (!existente) {
        throw crearError(404, "No hay un carrito activo");
    }

    const carrito = await marcarVencidoSiCorresponde(existente);

    if (carrito.estado !== "ACTIVO") {
        throw crearError(404, "No hay un carrito activo");
    }

    return obtenerCarritoDetallado(carrito.id_carrito);
};

// Devuelve el carrito con sus items ya enriquecidos con los datos del
// catálogo (nombre, imagen, precio vigente) y con el resumen de totales.
export const obtenerCarritoDetallado = async (valorId) => {
    const id_carrito = validarIdCarrito(valorId);

    const encontrado = await prisma.carrito.findUnique({
        where: { id_carrito },
        include: {
            rel_item_carrito_id_carrito: {
                orderBy: { created_at: "asc" },
            },
        },
    });

    if (!encontrado) {
        throw crearError(404, "Carrito no encontrado");
    }

    const carrito = await marcarVencidoSiCorresponde(encontrado);
    const items = carrito.rel_item_carrito_id_carrito;

    let mapaPresentaciones = new Map();

    // Con el carrito vacío no hace falta llamar al catálogo.
    if (items.length > 0) {
        try {
            const productos = await obtenerProductosCatalogo();

            mapaPresentaciones = construirMapaPresentaciones(productos);
        } catch (error) {
            console.error("Error al consultar el catálogo:", error);

            throw crearError(502, "No se pudo consultar el catálogo para armar el carrito");
        }
    }

    const lineas = items.map((item) =>
        construirLinea(
            item,
            mapaPresentaciones.get(Number(item.id_presentacion)),
            carrito.id_sucursal
        )
    );

    // No se devuelve token_invitado_hash: el front no lo necesita.
    return {
        id_carrito: carrito.id_carrito,
        id_cliente: carrito.id_cliente,
        estado: carrito.estado,
        moneda: carrito.moneda,
        id_sucursal: carrito.id_sucursal,
        vence_at: carrito.vence_at,
        created_at: carrito.created_at,
        updated_at: carrito.updated_at,
        items: lineas,
        resumen: construirResumen(lineas),
    };
};

// Elimina todos los items del carrito, pero el carrito sigue ACTIVO.
export const vaciarCarrito = async (valorId) => {
    const id_carrito = validarIdCarrito(valorId);

    const carrito = await prisma.carrito.findUnique({
        where: { id_carrito },
    });

    if (!carrito) {
        throw crearError(404, "Carrito no encontrado");
    }

    if (carrito.estado !== "ACTIVO") {
        throw crearError(400, "El carrito no está activo");
    }

    await prisma.itemCarrito.deleteMany({
        where: { id_carrito },
    });

    return obtenerCarritoDetallado(id_carrito);
};

// Marca el carrito como ABANDONADO. Libera el índice único para que el
// cliente pueda empezar un carrito nuevo; los items quedan como historial.
export const abandonarCarrito = async (valorId) => {
    const id_carrito = validarIdCarrito(valorId);

    const carrito = await prisma.carrito.findUnique({
        where: { id_carrito },
    });

    if (!carrito) {
        throw crearError(404, "Carrito no encontrado");
    }

    if (carrito.estado !== "ACTIVO") {
        throw crearError(400, "El carrito no está activo");
    }

    await prisma.carrito.update({
        where: { id_carrito },
        data: { estado: "ABANDONADO" },
    });

    return obtenerCarritoDetallado(id_carrito);
};