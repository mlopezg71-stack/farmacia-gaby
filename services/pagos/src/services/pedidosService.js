const PEDIDOS_URL =
    process.env.PEDIDOS_URL || "http://pedidos:3004";

export const confirmarPedido = async (
    id_pedido,
    id_actor = null
) => {
    const response = await fetch(
        `${PEDIDOS_URL}/pedidos/${id_pedido}/estado`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                estado: "CONFIRMADO",
                motivo: "Pago confirmado",
                id_actor,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al confirmar el pedido"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};

export const cancelarPedido = async (
    id_pedido,
    id_actor = null,
    motivo = "Pago cancelado"
) => {
    const response = await fetch(
        `${PEDIDOS_URL}/pedidos/${id_pedido}/estado`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                estado: "CANCELADO",
                motivo,
                id_actor,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al cancelar el pedido"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};