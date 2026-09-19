import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosConfig";

const NotificacionesDropdown = () => {
    const navigate = useNavigate();

    const [mostrar, setMostrar] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    const [totalNoLeidas, setTotalNoLeidas] = useState(0);

    useEffect(() => {
        obtenerNotificaciones();
        obtenerContador();
    }, []);

    const obtenerNotificaciones = async () => {
        try {
            const response = await axiosClient.get("/notificaciones");
            setNotificaciones(response.data);
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
        }
    };

    const obtenerContador = async () => {
        try {
            const response = await axiosClient.get("/notificaciones/contador");
            setTotalNoLeidas(response.data.total);
        } catch (error) {
            console.error("Error al obtener contador:", error);
        }
    };

    const marcarLeida = async (notificacion) => {
        try {
            await axiosClient.put(`/notificaciones/${notificacion.id_notificacion}/leida`);

            await obtenerNotificaciones();
            await obtenerContador();

            if (notificacion.url) {
                navigate(notificacion.url);
            }
        } catch (error) {
            console.error("Error al marcar notificación:", error);
        }
    };

    const marcarTodas = async () => {
        try {
            await axiosClient.put("/notificaciones/marcar-todas/leidas");

            await obtenerNotificaciones();
            await obtenerContador();
        } catch (error) {
            console.error("Error al marcar todas:", error);
        }
    };

    const styles = {
        bell: {
            position: "relative",
            fontSize: "20px",
            cursor: "pointer"
        },
        badge: {
            position: "absolute",
            top: "-9px",
            right: "-8px",
            backgroundColor: "#e8505b",
            color: "#fff",
            borderRadius: "50%",
            fontSize: "10px",
            width: "17px",
            height: "17px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        notificationBox: {
            position: "absolute",
            top: "35px",
            right: "0",
            width: "320px",
            backgroundColor: "#ffffff",
            border: "1px solid #e1e7f0",
            borderRadius: "14px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            padding: "12px",
            zIndex: 50
        },
        header: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px"
        },
        title: {
            color: "#102b5c",
            fontSize: "15px",
            fontWeight: "bold",
            margin: 0
        },
        item: {
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #edf1f7",
            marginBottom: "8px",
            cursor: "pointer",
            backgroundColor: "#f8fafd"
        },
        itemLeida: {
            backgroundColor: "#ffffff",
            opacity: 0.75
        },
        itemTitle: {
            fontSize: "13px",
            color: "#102b5c",
            fontWeight: "bold",
            marginBottom: "4px"
        },
        itemText: {
            fontSize: "12px",
            color: "#6b7890",
            marginBottom: "4px"
        },
        itemDate: {
            fontSize: "11px",
            color: "#9aa6b8"
        },
        empty: {
            fontSize: "13px",
            color: "#6b7890",
            padding: "12px",
            textAlign: "center"
        },
        button: {
            marginTop: "8px",
            width: "100%",
            padding: "8px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#0b2c5f",
            color: "#ffffff",
            cursor: "pointer",
            fontWeight: "bold"
        }
    };

    return (
        <div style={styles.bell} onClick={() => setMostrar(!mostrar)}>
            <FaBell />

            {totalNoLeidas > 0 && (
                <span style={styles.badge}>{totalNoLeidas}</span>
            )}

            {mostrar && (
                <div style={styles.notificationBox} onClick={(e) => e.stopPropagation()}>
                    <div style={styles.header}>
                        <h4 style={styles.title}>Notificaciones</h4>
                    </div>

                    {notificaciones.length > 0 ? (
                        <>
                            {notificaciones.slice(0, 8).map((notificacion) => (
                                <div
                                    key={notificacion.id_notificacion}
                                    onClick={() => marcarLeida(notificacion)}
                                    style={{
                                        ...styles.item,
                                        ...(notificacion.leida ? styles.itemLeida : {})
                                    }}
                                >
                                    <div style={styles.itemTitle}>
                                        {notificacion.titulo}
                                    </div>

                                    <div style={styles.itemText}>
                                        {notificacion.mensaje}
                                    </div>

                                    <div style={styles.itemDate}>
                                        {new Date(notificacion.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}

                            <button style={styles.button} onClick={marcarTodas}>
                                Marcar todas como leídas
                            </button>
                        </>
                    ) : (
                        <div style={styles.empty}>
                            No tienes notificaciones.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificacionesDropdown;