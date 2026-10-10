import prisma from "../config/prisma.js";
import { obtenerProductosCatalogo } from "./catalogoService.js";
import { obtenerDisponibilidadPresentacion } from "./inventarioService.js";
import {
    obtenerCarritoDetallado,
    construirMapaPresentaciones,
    seleccionarPrecioVigente,
} from "./carritoService.js";


// ======================================================
// CONSTANTES
// ======================================================

// Tope de unidades por línea del carrito. Evita cantidades absurdas
// que además desbordarían la columna INT. Se puede ajustar.
const CANTIDAD_MAXIMA_POR_ITEM = 999;


// ======================================================
// UTILIDADES INTERNAS
// ======================================================

// Crea un error con código HTTP para que el controller sepa qué responder.
const crearError = (status, message) => {
    const error = new Error(message);

    error.status = status;

    return error;
};

const validarEnteroPositivo = (valor, nombreCampo) => {
    const numero = Number(valor);

    if (
        valor === undefined ||
        valor === null ||
        valor === "" ||
        !Number.isInteger(numero) ||
        numero <= 0
    ) {
        throw crearError(400, `${nombreCampo} debe ser un número entero mayor que 0`);
    }

    return numero;
};

// Antes solo se validaba cantidad > 0, y una cantidad como 1.5 pasaba la
// validación pero reventaba al guardar (la columna es INT) con un error 500.
const validarCantidad = (valor) => {
    const cantidad = validarEnteroPositivo(valor, "La cantidad");

    if (cantidad > CANTIDAD_MAXIMA_POR_ITEM) {
        throw crearError(
            400,
            `La cantidad máxima por producto es ${CANTIDAD_MAXIMA_POR_ITEM}`
        );
    }

    return cantidad;
};

// Solo se puede modificar un carrito ACTIVO y que no haya vencido.
// Si ya pasó su vence_at se marca VENCIDO, igual que en carritoService.
const obtenerCarritoModificable = async (id_carrito) => {
    const carrito = await prisma.carrito.findUnique({
        where: { id_carrito },
    });

    if (!carrito) {
        throw crearError(404, "Carrito no encontrado");
    }

    if (carrito.estado === "ACTIVO" && carrito.vence_at <= new Date()) {
        await prisma.carrito.update({
            where: { id_carrito },
            data: { estado: "VENCIDO" },
        });

        throw crearError(400, "El carrito venció");
    }

    if (carrito.estado !== "ACTIVO") {
        throw crearError(400, "El carrito no está activo");
    }

    return carrito;
};

// Revisa que haya existencias en la sucursal del carrito para la cantidad pedida.
// - Sin sucursal en el carrito no se sabe qué inventario consultar; se omite.
// - Si Inventario no responde se deja continuar: la reserva que se hace al
//   crear el pedido vuelve a validar el stock y es la que manda.
const validarStockDisponible = async (carrito, id_presentacion, cantidadTotal) => {
    if (!carrito.id_sucursal) {
        return;
    }

    let disponible;

    try {
        disponible = await obtenerDisponibilidadPresentacion(
            id_presentacion,
            carrito.id_sucursal
        );
    } catch (error) {
        console.warn("No se pudo validar el stock, se continúa sin validarlo:", error.message);

        return;
    }

    if (cantidadTotal > disponible) {
        throw crearError(
            400,
            disponible > 0
                ? `Solo hay ${disponible} unidades disponibles en la sucursal`
                : "El producto no tiene existencias en la sucursal"
        );
    }
};

const obtenerItemOError = async (id_item_carrito) => {
    const item = await prisma.itemCarrito.findUnique({
        where: { id_item_carrito },
    });

    if (!item) {
        throw crearError(404, "Item del carrito no encontrado");
    }

    return item;
};


// ======================================================
// SERVICIOS PÚBLICOS DE ITEMS
// Los tres devuelven el carrito completo ya actualizado, así el front
// pinta el carrito con una sola llamada.
// ======================================================

// Agrega una presentación al carrito. Si ya estaba, suma la cantidad.
export const agregarItem = async ({ id_carrito, id_presentacion, cantidad }) => {
    const idCarrito = validarEnteroPositivo(id_carrito, "id_carrito");
    const idPresentacion = validarEnteroPositivo(id_presentacion, "id_presentacion");
    const cantidadNueva = validarCantidad(cantidad);

    const carrito = await obtenerCarritoModificable(idCarrito);

    let productos;

    try {
        productos = await obtenerProductosCatalogo();
    } catch (error) {
        console.error("Error al consultar el catálogo:", error);

        throw crearError(502, "No se pudo consultar el catálogo");
    }

    // El catálogo público solo trae productos publicados y presentaciones
    // ACTIVAS que permiten venta, así que si no aparece aquí no se puede vender.
    const datosCatalogo = construirMapaPresentaciones(productos).get(idPresentacion);

    if (!datosCatalogo) {
        throw crearError(404, "La presentación no está disponible en el catálogo público");
    }

    // Antes se tomaba precios[0] sin revisar vigencia, lista, canal ni sucursal.
    const precio = seleccionarPrecioVigente(
        datosCatalogo.presentacion.rel_precio_presentacion_id_presentacion,
        carrito.id_sucursal
    );

    if (!precio) {
        throw crearError(400, "La presentación no tiene un precio vigente");
    }

    const itemExistente = await prisma.itemCarrito.findUnique({
        where: {
            id_carrito_id_presentacion: {
                id_carrito: idCarrito,
                id_presentacion: idPresentacion,
            },
        },
    });

    if (
        itemExistente &&
        itemExistente.cantidad + cantidadNueva > CANTIDAD_MAXIMA_POR_ITEM
    ) {
        throw crearError(
            400,
            `La cantidad máxima por producto es ${CANTIDAD_MAXIMA_POR_ITEM}`
        );
    }

    await validarStockDisponible(
        carrito,
        idPresentacion,
        (itemExistente?.cantidad ?? 0) + cantidadNueva
    );

    // upsert + increment: si dos peticiones agregan lo mismo a la vez no se
    // rompe el índice único (id_carrito, id_presentacion) ni se pierde una suma.
    // precio_observado queda con el precio que el cliente está viendo ahora.
    await prisma.itemCarrito.upsert({
        where: {
            id_carrito_id_presentacion: {
                id_carrito: idCarrito,
                id_presentacion: idPresentacion,
            },
        },
        create: {
            id_carrito: idCarrito,
            id_presentacion: idPresentacion,
            cantidad: cantidadNueva,
            precio_observado: precio.importe,
        },
        update: {
            cantidad: { increment: cantidadNueva },
            precio_observado: precio.importe,
        },
    });

    return {
        carrito: await obtenerCarritoDetallado(idCarrito),
        creado: itemExistente === null,
    };
};

// Cambia la cantidad de un item. No toca precio_observado: así, si el precio
// cambió, el carrito sigue avisándolo con precio_cambio hasta que el cliente
// vuelva a agregar el producto.
export const actualizarItem = async ({ id_item_carrito, cantidad }) => {
    const idItem = validarEnteroPositivo(id_item_carrito, "El id del item");
    const cantidadNueva = validarCantidad(cantidad);

    const item = await obtenerItemOError(idItem);

    const carrito = await obtenerCarritoModificable(item.id_carrito);

    // Solo se valida el stock si la cantidad sube; bajarla siempre se permite.
    if (cantidadNueva > item.cantidad) {
        await validarStockDisponible(carrito, item.id_presentacion, cantidadNueva);
    }

    await prisma.itemCarrito.update({
        where: { id_item_carrito: idItem },
        data: { cantidad: cantidadNueva },
    });

    return obtenerCarritoDetallado(item.id_carrito);
};

// Elimina una línea del carrito.
export const eliminarItem = async (valorId) => {
    const idItem = validarEnteroPositivo(valorId, "El id del item");

    const item = await obtenerItemOError(idItem);

    await obtenerCarritoModificable(item.id_carrito);

    await prisma.itemCarrito.delete({
        where: { id_item_carrito: idItem },
    });

    return obtenerCarritoDetallado(item.id_carrito);
};