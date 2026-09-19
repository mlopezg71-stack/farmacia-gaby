import prisma from "../../src/config/prisma.js";
import { rolesIniciales } from "./roles.js";

const ejecutarSeed = async () => {
    try {
        console.log("Iniciando seed de Auth...");

        for (const rol of rolesIniciales) {
            await prisma.rol.upsert({
                where: {
                    codigo: rol.codigo,
                },
                update: {
                    nombre: rol.nombre,
                    descripcion: rol.descripcion,
                    estado: "ACTIVO",
                },
                create: {
                    ...rol,
                    estado: "ACTIVO",
                },
            });
        }

        console.log("Roles iniciales creados correctamente.");
    } catch (error) {
        console.error("Error al ejecutar el seed de Auth:", error);
        process.exitCode = 1;
    } finally {
        await prisma.$disconnect();
    }
};

ejecutarSeed();