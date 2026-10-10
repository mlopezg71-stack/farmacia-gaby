function PanelCarrito({ carrito, alAumentar, alDisminuir, alActualizar, alEliminar, alVaciar }) {
    return (
        <section
            style={{
                marginTop: "40px",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "15px",
                boxShadow: "0 5px 18px rgba(23, 74, 139, 0.06)",
                padding: "28px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <h2 style={{ margin: 0, color: "#123d73", fontSize: "22px" }}>
                    Mi carrito
                </h2>

                <span
                    style={{
                        color: "#008f49",
                        backgroundColor: "#e2f7eb",
                        borderRadius: "20px",
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: "700",
                    }}
                >
                    {carrito.cantidad_items} productos
                </span>
            </div>

            {carrito.items.length === 0 ? (
                <p style={{ color: "#8a94a6", fontSize: "15px" }}>
                    El carrito está vacío
                </p>
            ) : (
                <div>
                    {carrito.items.map((item) => (
                        <div
                            key={item.id_item_carrito}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "16px",
                                padding: "18px 0",
                                borderBottom: "1px solid #edf0f4",
                                flexWrap: "wrap",
                            }}
                        >
                            <div style={{ flex: 1, minWidth: "220px" }}>
                                <span
                                    style={{
                                        display: "block",
                                        color: "#00a651",
                                        fontSize: "12px",
                                        fontWeight: "700",
                                        marginBottom: "4px",
                                    }}
                                >
                                    {item.categoria}
                                </span>

                                <p
                                    style={{
                                        margin: "0 0 4px 0",
                                        fontWeight: "700",
                                        color: "#25364a",
                                        fontSize: "15px",
                                    }}
                                >
                                    {item.nombre}
                                </p>

                                <p style={{ margin: 0, color: "#8a94a6", fontSize: "13px" }}>
                                    Q{item.precio_observado.toFixed(2)} c/u
                                </p>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => alDisminuir(item.id_item_carrito)}
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        border: "1px solid #d8d8d8",
                                        borderRadius: "8px",
                                        backgroundColor: "#ffffff",
                                        color: "#174a8b",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                    }}
                                >
                                    -
                                </button>

                                <input
                                    type="number"
                                    min="1"
                                    defaultValue={item.cantidad}
                                    key={`${item.id_item_carrito}-${item.cantidad}`}
                                    onBlur={(event) => alActualizar(item.id_item_carrito, event.target.value)}
                                    style={{
                                        width: "60px",
                                        height: "32px",
                                        textAlign: "center",
                                        border: "1px solid #d8d8d8",
                                        borderRadius: "8px",
                                        outline: "none",
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() => alAumentar(item.id_item_carrito)}
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        border: "1px solid #d8d8d8",
                                        borderRadius: "8px",
                                        backgroundColor: "#ffffff",
                                        color: "#174a8b",
                                        fontWeight: "700",
                                        cursor: "pointer",
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            <strong
                                style={{
                                    color: "#174a8b",
                                    minWidth: "90px",
                                    textAlign: "right",
                                    fontSize: "17px",
                                }}
                            >
                                Q{item.subtotal.toFixed(2)}
                            </strong>

                            <button
                                type="button"
                                onClick={() => alEliminar(item.id_item_carrito)}
                                style={{
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "8px 12px",
                                    backgroundColor: "#fdecec",
                                    color: "#c0392b",
                                    fontWeight: "700",
                                    cursor: "pointer",
                                }}
                            >
                                Eliminar
                            </button>
                        </div>
                    ))}

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginTop: "22px",
                            paddingTop: "18px",
                            borderTop: "2px solid #edf0f4",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <h3 style={{ margin: 0, color: "#123d73", fontSize: "20px" }}>
                            Total: Q{carrito.total.toFixed(2)}
                        </h3>

                        <button
                            type="button"
                            onClick={alVaciar}
                            style={{
                                border: "none",
                                borderRadius: "8px",
                                padding: "10px 16px",
                                backgroundColor: "#fdecec",
                                color: "#c0392b",
                                fontWeight: "700",
                                cursor: "pointer",
                            }}
                        >
                            Vaciar carrito
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

export default PanelCarrito;
