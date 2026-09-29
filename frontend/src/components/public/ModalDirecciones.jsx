import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faLocationDot,
    faPlus,
    faPen,
    faTrash,
    faStar,
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:3001/api/auth";

const formularioInicial = {
    alias: "",
    destinatario: "",
    telefono: "",
    departamento: "",
    municipio: "",
    zona: "",
    direccion: "",
    referencias: "",
    latitud: "",
    longitud: "",
    predeterminada: false,
};

const ModalDirecciones = ({
    abierto,
    onCerrar,
}) => {
    const [direcciones, setDirecciones] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");

    const [direccionAEliminar, setDireccionAEliminar] = useState(null);
    const [eliminando, setEliminando] = useState(false);

    const [mostrarFormulario, setMostrarFormulario] =
        useState(false);

    const [direccionEditando, setDireccionEditando] =
        useState(null);

    const [formulario, setFormulario] = useState(
        formularioInicial
    );

    const cargarDirecciones = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("Debes iniciar sesión para administrar tus direcciones.");
            return;
        }

        try {
            setCargando(true);
            setError("");

            const respuesta = await fetch(
                `${API_URL}/direcciones`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.message ||
                    "No se pudieron cargar las direcciones"
                );
            }

            setDirecciones(datos.direcciones || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (abierto) {
            cargarDirecciones();
        }
    }, [abierto]);

    const abrirAgregar = () => {
        setDireccionEditando(null);
        setFormulario(formularioInicial);
        setError("");
        setMostrarFormulario(true);
    };

    const abrirEditar = (direccion) => {
        setDireccionEditando(direccion);

        setFormulario({
            alias: direccion.alias || "",
            destinatario: direccion.destinatario || "",
            telefono: direccion.telefono || "",
            departamento: direccion.departamento || "",
            municipio: direccion.municipio || "",
            zona: direccion.zona || "",
            direccion: direccion.direccion || "",
            referencias: direccion.referencias || "",
            latitud: direccion.latitud ?? "",
            longitud: direccion.longitud ?? "",
            predeterminada:
                direccion.predeterminada === true,
        });

        setError("");
        setMostrarFormulario(true);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setDireccionEditando(null);
        setFormulario(formularioInicial);
    };

    const cambiarCampo = (campo, valor) => {
        setFormulario((actual) => ({
            ...actual,
            [campo]: valor,
        }));
    };

    const guardarDireccion = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        if (!token) {
            setError("Debes iniciar sesión para guardar una dirección.");
            return;
        }

        try {
            setGuardando(true);
            setError("");

            const esEdicion = Boolean(direccionEditando);

            const url = esEdicion
                ? `${API_URL}/direcciones/${direccionEditando.id_direccion_cliente}`
                : `${API_URL}/direcciones`;

            const respuesta = await fetch(url, {
                method: esEdicion ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formulario,
                    latitud:
                        formulario.latitud === ""
                            ? null
                            : Number(formulario.latitud),
                    longitud:
                        formulario.longitud === ""
                            ? null
                            : Number(formulario.longitud),
                }),
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.message ||
                    "No se pudo guardar la dirección"
                );
            }

            cerrarFormulario();
            await cargarDirecciones();
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    };

    const eliminarDireccion = (direccion) => {
        setError("");
        setDireccionAEliminar(direccion);
    };

    const confirmarEliminarDireccion = async () => {
        if (!direccionAEliminar) return;

        const token = sessionStorage.getItem("token");

        try {
            setEliminando(true);
            setError("");

            const respuesta = await fetch(
                `${API_URL}/direcciones/${direccionAEliminar.id_direccion_cliente}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.message ||
                    "No se pudo eliminar la dirección"
                );
            }

            setDireccionAEliminar(null);
            await cargarDirecciones();
        } catch (error) {
            setError(error.message);
        } finally {
            setEliminando(false);
        }
    };

    const marcarPredeterminada = async (direccion) => {
        const token = sessionStorage.getItem("token");

        try {
            setError("");

            const respuesta = await fetch(
                `${API_URL}/direcciones/${direccion.id_direccion_cliente}/predeterminada`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.message ||
                    "No se pudo establecer la dirección predeterminada"
                );
            }

            await cargarDirecciones();
        } catch (error) {
            setError(error.message);
        }
    };

    if (!abierto) return null;

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(10, 25, 50, 0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10000,
                padding: "20px",
                boxSizing: "border-box",
            }}
            onClick={onCerrar}
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "85vh",
                    overflowY: "auto",
                    backgroundColor: "#ffffff",
                    borderRadius: "18px",
                    padding: "32px",
                    boxSizing: "border-box",
                    boxShadow:
                        "0 20px 60px rgba(0, 0, 0, 0.22)",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* CERRAR */}
                <button
                    type="button"
                    onClick={onCerrar}
                    aria-label="Cerrar"
                    style={{
                        position: "absolute",
                        top: "18px",
                        right: "18px",
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        border: "none",
                        backgroundColor: "#f3f6f9",
                        color: "#174a8b",
                        cursor: "pointer",
                        fontSize: "18px",
                    }}
                >
                    <FontAwesomeIcon icon={faXmark} />
                </button>

                {/* TITULO */}
                <h3
                    style={{
                        margin: "0 0 8px",
                        color: "#174a8b",
                        fontSize: "25px",
                        fontWeight: "800",
                        textAlign: "center",
                    }}
                >
                    Mis direcciones
                </h3>

                <p
                    style={{
                        margin: "0 0 25px",
                        color: "#778397",
                        fontSize: "14px",
                        textAlign: "center",
                    }}
                >
                    Administra las direcciones utilizadas para tus pedidos.
                </p>

                {/* ERROR */}
                {error && (
                    <div
                        style={{
                            marginBottom: "18px",
                            padding: "11px 14px",
                            borderRadius: "9px",
                            backgroundColor: "#fff1f1",
                            color: "#c62828",
                            fontSize: "13px",
                            border: "1px solid #ffcaca",
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* FORMULARIO */}
                {mostrarFormulario ? (
                    <form
                        onSubmit={guardarDireccion}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        <h4
                            style={{
                                margin: "0 0 4px",
                                color: "#174a8b",
                                fontSize: "18px",
                            }}
                        >
                            {direccionEditando
                                ? "Editar dirección"
                                : "Agregar dirección"}
                        </h4>

                        {[
                            ["alias", "Alias", "Ej. Casa"],
                            [
                                "destinatario",
                                "Destinatario",
                                "Nombre de quien recibe",
                            ],
                            [
                                "telefono",
                                "Teléfono",
                                "Teléfono de contacto",
                            ],
                            [
                                "departamento",
                                "Departamento",
                                "Ej. Guatemala",
                            ],
                            [
                                "municipio",
                                "Municipio",
                                "Ej. Guatemala",
                            ],
                            ["zona", "Zona", "Ej. Zona 9"],
                            [
                                "direccion",
                                "Dirección",
                                "Dirección exacta",
                            ],
                            [
                                "referencias",
                                "Referencias",
                                "Referencias adicionales",
                            ],
                        ].map(
                            ([
                                campo,
                                etiqueta,
                                placeholder,
                            ]) => (
                                <div key={campo}>
                                    <label
                                        style={{
                                            display: "block",
                                            marginBottom: "5px",
                                            color: "#174a8b",
                                            fontSize: "13px",
                                            fontWeight: "700",
                                        }}
                                    >
                                        {etiqueta}
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            formulario[campo]
                                        }
                                        placeholder={placeholder}
                                        onChange={(e) =>
                                            cambiarCampo(
                                                campo,
                                                e.target.value
                                            )
                                        }
                                        required={[
                                            "alias",
                                            "destinatario",
                                            "telefono",
                                            "departamento",
                                            "municipio",
                                            "direccion",
                                        ].includes(campo)}
                                        style={{
                                            width: "100%",
                                            height: "45px",
                                            padding: "0 13px",
                                            border:
                                                "1px solid #dde4ec",
                                            borderRadius: "9px",
                                            boxSizing:
                                                "border-box",
                                            outline: "none",
                                            fontSize: "14px",
                                        }}
                                    />
                                </div>
                            )
                        )}

                        <label
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "9px",
                                color: "#174a8b",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={
                                    formulario.predeterminada
                                }
                                onChange={(e) =>
                                    cambiarCampo(
                                        "predeterminada",
                                        e.target.checked
                                    )
                                }
                            />

                            Usar como dirección predeterminada
                        </label>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "5px",
                            }}
                        >
                            <button
                                type="button"
                                onClick={cerrarFormulario}
                                style={{
                                    flex: 1,
                                    height: "46px",
                                    border: "1px solid #dde4ec",
                                    borderRadius: "9px",
                                    backgroundColor: "#ffffff",
                                    color: "#174a8b",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                }}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={guardando}
                                style={{
                                    flex: 1,
                                    height: "46px",
                                    border: "none",
                                    borderRadius: "9px",
                                    backgroundColor: "#00a859",
                                    color: "#ffffff",
                                    fontWeight: "700",
                                    cursor: guardando
                                        ? "default"
                                        : "pointer",
                                }}
                            >
                                {guardando
                                    ? "Guardando..."
                                    : "Guardar dirección"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {/* AGREGAR */}
                        <button
                            type="button"
                            onClick={abrirAgregar}
                            style={{
                                width: "100%",
                                height: "48px",
                                border: "none",
                                borderRadius: "9px",
                                backgroundColor: "#00a859",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "9px",
                                marginBottom: "20px",
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            Agregar dirección
                        </button>

                        {/* CARGANDO */}
                        {cargando ? (
                            <div
                                style={{
                                    padding: "35px 20px",
                                    textAlign: "center",
                                    color: "#778397",
                                    fontSize: "14px",
                                }}
                            >
                                Cargando direcciones...
                            </div>
                        ) : direcciones.length === 0 ? (
                            /* VACÍO */
                            <div
                                style={{
                                    border: "1px solid #e0e6ed",
                                    borderRadius: "12px",
                                    padding: "30px 20px",
                                    textAlign: "center",
                                    backgroundColor: "#fafcfe",
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={faLocationDot}
                                    style={{
                                        fontSize: "30px",
                                        color: "#174a8b",
                                        marginBottom: "12px",
                                    }}
                                />

                                <p
                                    style={{
                                        margin: "0 0 6px",
                                        color: "#174a8b",
                                        fontSize: "16px",
                                        fontWeight: "700",
                                    }}
                                >
                                    No hay direcciones guardadas
                                </p>

                                <p
                                    style={{
                                        margin: 0,
                                        color: "#778397",
                                        fontSize: "13px",
                                        lineHeight: "1.5",
                                    }}
                                >
                                    Agrega una dirección para utilizarla
                                    posteriormente en tus pedidos.
                                </p>
                            </div>
                        ) : (
                            /* DIRECCIONES */
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "12px",
                                }}
                            >
                                {direcciones.map((direccion) => (
                                    <div
                                        key={
                                            direccion.id_direccion_cliente
                                        }
                                        style={{
                                            border: direccion.predeterminada
                                                ? "2px solid #00a859"
                                                : "1px solid #e0e6ed",
                                            borderRadius: "12px",
                                            padding: "17px",
                                            backgroundColor: "#fafcfe",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                                gap: "12px",
                                            }}
                                        >
                                            <div>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: "7px",
                                                        color: "#174a8b",
                                                        fontWeight: "800",
                                                        fontSize: "16px",
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faLocationDot
                                                        }
                                                    />
                                                    {direccion.alias}
                                                </div>

                                                {direccion.predeterminada && (
                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "5px",
                                                            marginTop:
                                                                "6px",
                                                            padding:
                                                                "4px 8px",
                                                            borderRadius:
                                                                "20px",
                                                            backgroundColor:
                                                                "#e8f8ef",
                                                            color: "#008f4c",
                                                            fontSize:
                                                                "11px",
                                                            fontWeight:
                                                                "700",
                                                        }}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={faStar}
                                                        />
                                                        Predeterminada
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "6px",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        abrirEditar(
                                                            direccion
                                                        )
                                                    }
                                                    title="Editar"
                                                    style={{
                                                        width: "34px",
                                                        height: "34px",
                                                        border: "none",
                                                        borderRadius:
                                                            "8px",
                                                        backgroundColor:
                                                            "#eef4fb",
                                                        color: "#174a8b",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faPen}
                                                    />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        eliminarDireccion(
                                                            direccion
                                                        )
                                                    }
                                                    title="Eliminar"
                                                    style={{
                                                        width: "34px",
                                                        height: "34px",
                                                        border: "none",
                                                        borderRadius:
                                                            "8px",
                                                        backgroundColor:
                                                            "#fff0f0",
                                                        color: "#c62828",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div
                                            style={{
                                                marginTop: "12px",
                                                color: "#4d596b",
                                                fontSize: "13px",
                                                lineHeight: "1.6",
                                            }}
                                        >
                                            <strong>
                                                {direccion.destinatario}
                                            </strong>

                                            <br />

                                            {direccion.telefono}

                                            <br />

                                            {direccion.direccion}

                                            <br />

                                            {direccion.municipio},{" "}
                                            {direccion.departamento}

                                            {direccion.zona && (
                                                <>
                                                    <br />
                                                    {direccion.zona}
                                                </>
                                            )}

                                            {direccion.referencias && (
                                                <>
                                                    <br />
                                                    <span
                                                        style={{
                                                            color: "#778397",
                                                        }}
                                                    >
                                                        Referencias:{" "}
                                                        {
                                                            direccion.referencias
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        {!direccion.predeterminada && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    marcarPredeterminada(
                                                        direccion
                                                    )
                                                }
                                                style={{
                                                    marginTop: "12px",
                                                    border: "none",
                                                    backgroundColor:
                                                        "transparent",
                                                    color: "#174a8b",
                                                    fontSize: "13px",
                                                    fontWeight: "700",
                                                    cursor: "pointer",
                                                    padding: 0,
                                                }}
                                            >
                                                Marcar como predeterminada
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {direccionAEliminar && (
                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            backgroundColor: "rgba(10, 25, 50, 0.60)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 11000,
                            padding: "20px",
                            boxSizing: "border-box",
                        }}
                        onClick={() => {
                            if (!eliminando) {
                                setDireccionAEliminar(null);
                            }
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                maxWidth: "480px",
                                backgroundColor: "#ffffff",
                                borderRadius: "18px",
                                padding: "32px",
                                boxSizing: "border-box",
                                textAlign: "center",
                                boxShadow:
                                    "0 20px 60px rgba(0, 0, 0, 0.25)",
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                style={{
                                    width: "64px",
                                    height: "64px",
                                    margin: "0 auto 18px",
                                    borderRadius: "50%",
                                    backgroundColor: "#fff1f1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#c62828",
                                    fontSize: "27px",
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </div>

                            <h3
                                style={{
                                    margin: "0 0 10px",
                                    color: "#174a8b",
                                    fontSize: "24px",
                                    fontWeight: "800",
                                }}
                            >
                                ¿Eliminar dirección?
                            </h3>

                            <p
                                style={{
                                    margin: "0 0 8px",
                                    color: "#4d596b",
                                    fontSize: "15px",
                                }}
                            >
                                Estás a punto de eliminar:
                            </p>

                            <p
                                style={{
                                    margin: "0 0 25px",
                                    color: "#174a8b",
                                    fontSize: "17px",
                                    fontWeight: "800",
                                }}
                            >
                                {direccionAEliminar.alias}
                            </p>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                }}
                            >
                                <button
                                    type="button"
                                    disabled={eliminando}
                                    onClick={() =>
                                        setDireccionAEliminar(null)
                                    }
                                    style={{
                                        flex: 1,
                                        height: "48px",
                                        border: "1px solid #dde4ec",
                                        borderRadius: "9px",
                                        backgroundColor: "#ffffff",
                                        color: "#174a8b",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="button"
                                    disabled={eliminando}
                                    onClick={confirmarEliminarDireccion}
                                    style={{
                                        flex: 1,
                                        height: "48px",
                                        border: "none",
                                        borderRadius: "9px",
                                        backgroundColor: "#c62828",
                                        color: "#ffffff",
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                    }}
                                >
                                    {eliminando
                                        ? "Eliminando..."
                                        : "Eliminar"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ModalDirecciones;