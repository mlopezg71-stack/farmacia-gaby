const CATALOGO_URL =
    process.env.CATALOGO_URL || "http://catalogo:3002";

export const obtenerProductosCatalogo = async () => {
    const response = await fetch(
        `${CATALOGO_URL}/productos`
    );

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message ||
            "Error al obtener los productos del catálogo"
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
};