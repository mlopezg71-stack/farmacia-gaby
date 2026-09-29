import prisma from "../config/prisma.js";

// Crear contacto de un pedido
export const crearPedidoContacto = async (req, res) => {
    try {
        const {
            id_pedido,
            comprador_nombre,
            comprador_correo,
            comprador_telefono,
            destinatario,
            telefono_entrega,
            departamento,
            municipio,
            zona,
            direccion,
            referencias,
            latitud,
            longitud,
            instrucciones,
        } = req.body;

        if (
            !id_pedido ||
            !comprador_nombre ||
            !comprador_telefono
        ) {
            return res.status(400).json({
                message:
                    "id_pedido, comprador_nombre y comprador_telefono son obligatorios",
            });
        }

        const pedido = await prisma.pedido.findUnique({
            where: {
                id_pedido: Number(id_pedido),
            },
        });

        if (!pedido) {
            return res.status(404).json({
                message: "Pedido no encontrado",
            });
        }

        const contactoExistente = await prisma.pedidoContacto.findUnique({
            where: {
                id_pedido: Number(id_pedido),
            },
        });

        if (contactoExistente) {
            return res.status(409).json({
                message: "El pedido ya tiene información de contacto",
            });
        }

        const contacto = await prisma.pedidoContacto.create({
            data: {
                id_pedido: Number(id_pedido),
                comprador_nombre,
                comprador_correo: comprador_correo ?? null,
                comprador_telefono,
                destinatario: destinatario ?? null,
                telefono_entrega: telefono_entrega ?? null,
                departamento: departamento ?? null,
                municipio: municipio ?? null,
                zona: zona ?? null,
                direccion: direccion ?? null,
                referencias: referencias ?? null,
                latitud: latitud ?? null,
                longitud: longitud ?? null,
                instrucciones: instrucciones ?? null,
            },
        });

        res.status(201).json(contacto);
    } catch (error) {
        console.error("Error al crear contacto del pedido:", error);

        res.status(500).json({
            message: "Error al crear el contacto del pedido",
        });
    }
};

// Obtener contacto de un pedido
export const obtenerPedidoContacto = async (req, res) => {
    try {
        const { id_pedido } = req.params;

        const contacto = await prisma.pedidoContacto.findUnique({
            where: {
                id_pedido: Number(id_pedido),
            },
        });

        if (!contacto) {
            return res.status(404).json({
                message: "Información de contacto no encontrada",
            });
        }

        res.status(200).json(contacto);
    } catch (error) {
        console.error("Error al obtener contacto del pedido:", error);

        res.status(500).json({
            message: "Error al obtener el contacto del pedido",
        });
    }
};