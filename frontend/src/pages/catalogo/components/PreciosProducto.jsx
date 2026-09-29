import {
    FaMoneyBillWave,
    FaPlus,
    FaTrash,
} from "react-icons/fa";

const PreciosProducto = ({
    precios = [],
    listasPrecio = [],
    onChange,
    disabled = false,
}) => {
    const crearPrecioVacio = () => ({
        id_precio_presentacion: null,
        id_lista: "",
        importe: "",
        incluye_impuesto: true,
        tasa_impuesto: "12",
        id_sucursal: "",
        canal: "TODOS",
        desde: "",
        hasta: "",
    });

    const agregarPrecio = () => {
        if (disabled) return;

        onChange([
            ...precios,
            crearPrecioVacio(),
        ]);
    };

    const modificarPrecio = (
        index,
        campo,
        valor
    ) => {
        if (disabled) return;

        onChange(
            precios.map((precio, i) =>
                i === index
                    ? {
                        ...precio,
                        [campo]: valor,
                    }
                    : precio
            )
        );
    };

    const eliminarPrecio = (index) => {
        if (disabled) return;

        onChange(
            precios.filter(
                (_, i) => i !== index
            )
        );
    };

    const styles = {
        section: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2ebe7",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow:
                "0 7px 20px rgba(17,48,65,0.06)",
            marginBottom: "20px",
        },

        header: {
            padding: "20px 22px",
            borderBottom: "1px solid #edf2f0",
            backgroundColor: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
        },

        headerLeft: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
        },

        iconBox: {
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            backgroundColor: "#eaf7f0",
            color: "#159447",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "17px",
        },

        title: {
            margin: 0,
            color: "#082b4f",
            fontSize: "18px",
            fontWeight: "700",
        },

        subtitle: {
            margin: "5px 0 0",
            color: "#7a8984",
            fontSize: "13px",
        },

        addButton: {
            border: "none",
            backgroundColor: "#159447",
            color: "#ffffff",
            borderRadius: "9px",
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: disabled
                ? "default"
                : "pointer",
            opacity: disabled ? 0.6 : 1,
        },

        body: {
            padding: "22px",
        },

        info: {
            padding: "12px 14px",
            borderRadius: "9px",
            backgroundColor: "#f8fbfa",
            border: "1px solid #e2ebe7",
            color: "#61736d",
            fontSize: "12px",
            marginBottom: "18px",
            lineHeight: "1.5",
        },

        empty: {
            textAlign: "center",
            padding: "35px 20px",
            color: "#81918c",
            border: "1px dashed #ccd9d4",
            borderRadius: "10px",
            backgroundColor: "#fafcfb",
        },

        emptyIcon: {
            fontSize: "30px",
            color: "#b8c8c2",
            marginBottom: "10px",
        },

        priceCard: {
            border: "1px solid #dfeae6",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "15px",
            backgroundColor: "#ffffff",
        },

        priceHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "17px",
            paddingBottom: "12px",
            borderBottom: "1px solid #edf2f0",
        },

        priceTitle: {
            color: "#082b4f",
            fontSize: "14px",
            fontWeight: "700",
        },

        removeButton: {
            border: "1px solid #f0d8d8",
            backgroundColor: "#fff7f7",
            color: "#c0392b",
            width: "34px",
            height: "34px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled
                ? "default"
                : "pointer",
        },

        // =========================================
        // FILAS CONTROLADAS
        // =========================================
        row: {
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "15px",
            width: "100%",
        },

        field: {
            display: "flex",
            flexDirection: "column",
            gap: "7px",
            minWidth: 0,
        },

        label: {
            color: "#082b4f",
            fontSize: "12px",
            fontWeight: "700",
        },

        required: {
            color: "#c0392b",
            marginLeft: "3px",
        },

        input: {
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #dfeae6",
            borderRadius: "9px",
            padding: "10px 11px",
            fontSize: "13px",
            color: "#243b53",
            backgroundColor: disabled
                ? "#f5f7f6"
                : "#ffffff",
            outline: "none",
        },

        select: {
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #dfeae6",
            borderRadius: "9px",
            padding: "10px 11px",
            fontSize: "13px",
            color: "#243b53",
            backgroundColor: disabled
                ? "#f5f7f6"
                : "#ffffff",
            outline: "none",
        },

        checkBoxContainer: {
            display: "flex",
            alignItems: "center",
            gap: "9px",
            minHeight: "39px",
            padding: "0 4px",
        },

        checkbox: {
            width: "17px",
            height: "17px",
            accentColor: "#159447",
            cursor: disabled
                ? "default"
                : "pointer",
        },

        checkLabel: {
            color: "#082b4f",
            fontSize: "12px",
            fontWeight: "600",
        },

        help: {
            color: "#81918c",
            fontSize: "10px",
            marginTop: "2px",
        },
    };

    return (
        <section style={styles.section}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconBox}>
                        <FaMoneyBillWave />
                    </div>

                    <div>
                        <h2 style={styles.title}>
                            Precios
                        </h2>

                        <p style={styles.subtitle}>
                            Configuración de precios
                            asociados a la presentación
                            del producto.
                        </p>
                    </div>
                </div>

                {!disabled && (
                    <button
                        type="button"
                        onClick={agregarPrecio}
                        style={styles.addButton}
                    >
                        <FaPlus />
                        Agregar precio
                    </button>
                )}
            </div>

            <div style={styles.body}>
                <div style={styles.info}>
                    Los precios se asignan a una
                    presentación del producto. Puedes
                    registrar diferentes listas,
                    canales y períodos de vigencia.
                </div>

                {precios.length === 0 ? (
                    <div style={styles.empty}>
                        <FaMoneyBillWave
                            style={styles.emptyIcon}
                        />

                        <div>
                            <strong>
                                No hay precios
                                registrados
                            </strong>
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                                marginTop: "5px",
                            }}
                        >
                            Utiliza "Agregar precio"
                            para registrar uno.
                        </div>
                    </div>
                ) : (
                    precios.map(
                        (precio, index) => (
                            <div
                                key={
                                    precio.id_precio_presentacion ||
                                    `precio-${index}`
                                }
                                style={
                                    styles.priceCard
                                }
                            >
                                <div
                                    style={
                                        styles.priceHeader
                                    }
                                >
                                    <div
                                        style={
                                            styles.priceTitle
                                        }
                                    >
                                        Precio {index + 1}
                                    </div>

                                    {!disabled && (
                                        <button
                                            type="button"
                                            title="Eliminar precio"
                                            onClick={() =>
                                                eliminarPrecio(
                                                    index
                                                )
                                            }
                                            style={
                                                styles.removeButton
                                            }
                                        >
                                            <FaTrash />
                                        </button>
                                    )}
                                </div>

                                {/* =====================================
                                    FILA 1
                                    LISTA | IMPORTE | CANAL
                                ===================================== */}

                                <div style={styles.row}>
                                    {/* WIDTH LISTA DE PRECIO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "300px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Lista de precio
                                            <span
                                                style={
                                                    styles.required
                                                }
                                            >
                                                *
                                            </span>
                                        </label>

                                        <select
                                            value={
                                                precio.id_lista ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "id_lista",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.select
                                            }
                                        >
                                            <option value="">
                                                Seleccione
                                                una lista
                                            </option>

                                            {listasPrecio.map(
                                                (
                                                    lista
                                                ) => (
                                                    <option
                                                        key={
                                                            lista.id_lista_precio
                                                        }
                                                        value={
                                                            lista.id_lista_precio
                                                        }
                                                    >
                                                        {
                                                            lista.nombre
                                                        }
                                                        {lista.moneda
                                                            ? ` - ${lista.moneda}`
                                                            : ""}
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* WIDTH IMPORTE */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "180px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Importe
                                            <span
                                                style={
                                                    styles.required
                                                }
                                            >
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                precio.importe ??
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "importe",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="0.00"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* WIDTH CANAL */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "180px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Canal
                                        </label>

                                        <select
                                            value={
                                                precio.canal ||
                                                "TODOS"
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "canal",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.select
                                            }
                                        >
                                            <option value="TODOS">
                                                Todos
                                            </option>

                                            <option value="WEB">
                                                Web
                                            </option>

                                            <option value="TIENDA">
                                                Tienda
                                            </option>
                                        </select>
                                    </div>
                                    {/* WIDTH SUCURSAL */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "260px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            ID sucursal
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                precio.id_sucursal ??
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "id_sucursal",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Vacío = precio general"
                                            style={
                                                styles.input
                                            }
                                        />

                                        <span
                                            style={
                                                styles.help
                                            }
                                        >
                                            Déjalo vacío
                                            para aplicar
                                            el precio de
                                            forma general.
                                        </span>
                                    </div>

                                    {/* WIDTH TASA IMPUESTO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "170px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Tasa de impuesto
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                precio.tasa_impuesto ??
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "tasa_impuesto",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="12"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                </div>

                                {/* =====================================
                                    FILA 2
                                    SUCURSAL | IMPUESTO | CHECK
                                ===================================== */}

                                <div style={styles.row}>

                                    {/* WIDTH INCLUYE IMPUESTO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "240px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Impuestos
                                        </label>

                                        <div
                                            style={
                                                styles.checkBoxContainer
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    precio.incluye_impuesto ??
                                                    true
                                                }
                                                disabled={
                                                    disabled
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    modificarPrecio(
                                                        index,
                                                        "incluye_impuesto",
                                                        event
                                                            .target
                                                            .checked
                                                    )
                                                }
                                                style={
                                                    styles.checkbox
                                                }
                                            />

                                            <span
                                                style={
                                                    styles.checkLabel
                                                }
                                            >
                                                El importe incluye impuesto
                                            </span>
                                        </div>
                                    </div>

                                    {/* WIDTH DESDE */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "260px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Vigente desde
                                        </label>

                                        <input
                                            type="datetime-local"
                                            value={
                                                precio.desde ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "desde",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* WIDTH HASTA */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "260px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Vigente hasta
                                        </label>

                                        <input
                                            type="datetime-local"
                                            value={
                                                precio.hasta ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPrecio(
                                                    index,
                                                    "hasta",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    )
                )}
            </div>
        </section>
    );
};

export default PreciosProducto;