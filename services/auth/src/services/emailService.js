import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const enviarCodigoRecuperacion = async (
    correoDestino,
    codigo,
    nombreCompleto
) => {
    const mailOptions = {
        from: `"Farmacia Gaby" <${process.env.EMAIL_USER}>`,
        to: correoDestino,
        subject: "Código de recuperación de contraseña - Farmacia Gaby",
        html: `
            <div
                style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    color: #292929;
                    line-height: 1.5;
                "
            >
                <h2 style="color: #082b4f;">
                    Recuperación de contraseña
                </h2>

                <p>
                    Hola <strong>${nombreCompleto}</strong>,
                </p>

                <p>
                    Se solicitó recuperar la contraseña de tu cuenta
                    de Farmacia Gaby.
                </p>

                <p>
                    Tu código de recuperación es:
                </p>

                <div
                    style="
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        margin: 25px 0;
                        color: #159447;
                    "
                >
                    ${codigo}
                </div>

                <p>
                    Este código vencerá en <strong>15 minutos</strong>.
                </p>

                <p>
                    Si no solicitaste este cambio, puedes ignorar
                    este correo.
                </p>

                <hr
                    style="
                        border: none;
                        border-top: 1px solid #dddddd;
                        margin-top: 25px;
                    "
                />

                <small style="color: #777777;">
                    Farmacia Gaby - Cuidando la salud del hogar
                </small>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};