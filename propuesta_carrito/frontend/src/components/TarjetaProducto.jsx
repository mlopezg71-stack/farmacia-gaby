function TarjetaProducto({ producto, cantidad, alCambiarCantidad, alAgregar }) {
    return (
        <article
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "15px",
                overflow: "hidden",
                boxShadow: "0 5px 18px rgba(23, 74, 139, 0.06)",
            }}
        >
            <div
                style={{
                    height: "190px",
                    backgroundColor: "#f6f8fb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid #edf0f4",
                }}
            >
                <div
                    style={{
                        width: "90px",
                        height: "115px",
                        backgroundColor: "#ffffff",
                        border: "2px solid #dce5ee",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#174a8b",
                        fontSize: "12px",
                        fontWeight: "800",
                        textAlign: "center",
                        lineHeight: "1.4",
                        padding: "10px",
                        boxSizing: "border-box",
                    }}
                >
                    FARMACIA
                    <br />
                    GABY
                </div>
            </div>

            <div style={{ padding: "22px" }}>
                <span
                    style={{
                        display: "block",
                        color: "#00a651",
                        fontSize: "12px",
                        fontWeight: "700",
                        marginBottom: "8px",
                    }}
                >
                    {producto.categoria}
                </span>

                <h3
                    style={{
                        margin: "0 0 16px 0",
                        color: "#25364a",
                        fontSize: "15px",
                        lineHeight: "1.45",
                        minHeight: "65px",
                        fontWeight: "700",
                    }}
                >
                    {producto.nombre}
                </h3>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        marginBottom: "18px",
                    }}
                >
                    <strong style={{ color: "#174a8b", fontSize: "22px" }}>
                        Q{producto.precio.toFixed(2)}
                    </strong>

                    <span
                        style={{
                            color: "#008f49",
                            backgroundColor: "#eaf8f0",
                            borderRadius: "20px",
                            padding: "6px 10px",
                            fontSize: "11px",
                            fontWeight: "700",
                        }}
                    >
                        Disponible
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => alCambiarCantidad(producto.id_presentacion, Math.max(1, Number(cantidad) - 1))}
                        style={{
                            width: "36px",
                            height: "36px",
                            border: "1px solid #d8d8d8",
                            borderRadius: "8px",
                            backgroundColor: "#ffffff",
                            color: "#174a8b",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                        }}
                    >
                        -
                    </button>

                    <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(event) => alCambiarCantidad(producto.id_presentacion, event.target.value)}
                        style={{
                            flex: 1,
                            height: "36px",
                            textAlign: "center",
                            border: "1px solid #d8d8d8",
                            borderRadius: "8px",
                            fontSize: "14px",
                            outline: "none",
                        }}
                    />

                    <button
                        type="button"
                        onClick={() => alCambiarCantidad(producto.id_presentacion, Number(cantidad) + 1)}
                        style={{
                            width: "36px",
                            height: "36px",
                            border: "1px solid #d8d8d8",
                            borderRadius: "8px",
                            backgroundColor: "#ffffff",
                            color: "#174a8b",
                            fontSize: "16px",
                            fontWeight: "700",
                            cursor: "pointer",
                        }}
                    >
                        +
                    </button>
                </div>

                <button
                    type="button"
                    onClick={() => alAgregar(producto.id_presentacion)}
                    style={{
                        width: "100%",
                        border: "none",
                        borderRadius: "8px",
                        padding: "12px",
                        backgroundColor: "#174a8b",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                    }}
                >
                    Agregar al carrito
                </button>
            </div>
        </article>
    );
}

export default TarjetaProducto;
