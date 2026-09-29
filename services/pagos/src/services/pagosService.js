const PAGOS_URL =
    process.env.PAGOS_URL || "http://pagos:3005";

export const crearPago = async ({
    id_pedido,
    id_cliente,
    monto,
    metodo,
    clave_idempotencia,
}) => {
    const response = await fetch(
        `${PAGOS_URL}/pagos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id_pedido,
                id_cliente,
                monto,
                metodo,
                clave_idempotencia,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al crear el pago"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};
export const obtenerPagosPorPedido = async (id_pedido) => {
    const response = await fetch(
        `${PAGOS_URL}/pagos/pedido/${id_pedido}`
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al obtener los pagos del pedido"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};