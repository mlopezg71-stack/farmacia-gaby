const INVENTARIO_URL =
    process.env.INVENTARIO_URL || "http://inventario:3003";

export const crearReservaInventario = async ({
    id_pedido,
    id_sucursal,
    clave_idempotencia,
    vence_at,
    detalles,
}) => {
    const response = await fetch(
        `${INVENTARIO_URL}/reservas`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_pedido,
                id_sucursal,
                clave_idempotencia,
                vence_at,
                detalles,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al reservar inventario"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};
export const obtenerReservaPorPedido = async (id_pedido) => {
    const response = await fetch(
        `${INVENTARIO_URL}/reservas/pedido/${id_pedido}`
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al obtener la reserva de inventario"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};
export const confirmarReservaInventario = async (
    id_reserva,
    id_actor = null
) => {
    const response = await fetch(
        `${INVENTARIO_URL}/reservas/${id_reserva}/confirmar`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_actor,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al confirmar la reserva de inventario"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};

export const liberarReservaInventario = async (
    id_reserva,
    id_actor = null,
    motivo = null
) => {
    const response = await fetch(
        `${INVENTARIO_URL}/reservas/${id_reserva}/liberar`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_actor,
                motivo,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al liberar la reserva de inventario"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};
export const consumirReservaInventario = async (
    id_reserva,
    id_actor = null
) => {
    const response = await fetch(
        `${INVENTARIO_URL}/reservas/${id_reserva}/consumir`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_actor,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al consumir la reserva de inventario"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};


// Cantidad total disponible de una presentación en una sucursal
// (existencia física menos reservada, sumando todos los lotes).
export const obtenerDisponibilidadPresentacion = async (
    id_presentacion,
    id_sucursal
) => {
    const response = await fetch(
        `${INVENTARIO_URL}/existencias?id_presentacion=${id_presentacion}&id_sucursal=${id_sucursal}`
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al consultar la disponibilidad de inventario"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return Number(data.cantidad_disponible);
};