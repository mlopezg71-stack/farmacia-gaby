import {
    FaBoxOpen,
    FaPlus,
    FaTrash,
} from "react-icons/fa";

const TIPOS_PRESENTACION = [
    { value: "UNIDAD", label: "Unidad" },
    { value: "BLISTER", label: "Blíster" },
    { value: "CAJA", label: "Caja" },
    { value: "FRASCO", label: "Frasco" },
    { value: "TUBO", label: "Tubo" },
    { value: "SOBRE", label: "Sobre" },
    { value: "PAQUETE", label: "Paquete" },
    { value: "OTRO", label: "Otro" },
];

const PresentacionesProducto = ({
    presentaciones = [],
    onChange,
    disabled = false,
}) => {
    const crearPresentacionVacia = () => ({
        id_presentacion_producto: null,
        sku: "",
        codigo_barras: "",
        nombre: "",
        tipo: "UNIDAD",
        unidades_base: "1",
        contenido: "",
        unidad_contenido: "",
        forma_farmaceutica: "",
        concentracion_descriptiva: "",
        permite_venta: true,
        permite_fraccionamiento: false,
        peso_gramos: "",
        estado: "ACTIVO",
        precios: [],
    });

    const agregarPresentacion = () => {
        if (disabled) return;

        onChange([
            ...presentaciones,
            crearPresentacionVacia(),
        ]);
    };

    const modificarPresentacion = (
        index,
        campo,
        valor
    ) => {
        if (disabled) return;

        onChange(
            presentaciones.map(
                (presentacion, i) =>
                    i === index
                        ? {
                            ...presentacion,
                            [campo]: valor,
                        }
                        : presentacion
            )
        );
    };

    const eliminarPresentacion = (index) => {
        if (disabled) return;

        onChange(
            presentaciones.filter(
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
            fontSize: "31px",
            color: "#b8c8c2",
            marginBottom: "10px",
        },

        card: {
            border: "1px solid #dfeae6",
            borderRadius: "12px",
            padding: "18px",
            marginBottom: "15px",
            backgroundColor: "#ffffff",
        },

        cardHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
            paddingBottom: "12px",
            borderBottom: "1px solid #edf2f0",
        },

        cardTitleArea: {
            display: "flex",
            alignItems: "center",
            gap: "9px",
        },

        numberBox: {
            width: "29px",
            height: "29px",
            borderRadius: "8px",
            backgroundColor: "#eaf7f0",
            color: "#159447",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "800",
        },

        cardTitle: {
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

        // =====================================================
        // FILAS CONTROLADAS
        // =====================================================
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

        switches: {
            display: "flex",
            gap: "22px",
            marginTop: "4px",
            paddingTop: "16px",
            borderTop: "1px solid #edf2f0",
        },

        checkContainer: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
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

        badge: {
            display: "inline-flex",
            alignItems: "center",
            padding: "5px 9px",
            borderRadius: "20px",
            backgroundColor: "#eaf7f0",
            color: "#159447",
            fontSize: "10px",
            fontWeight: "800",
        },
    };

    return (
        <section style={styles.section}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconBox}>
                        <FaBoxOpen />
                    </div>

                    <div>
                        <h2 style={styles.title}>
                            Presentaciones
                        </h2>

                        <p style={styles.subtitle}>
                            Define las formas en que
                            este producto se venderá.
                        </p>
                    </div>
                </div>

                {!disabled && (
                    <button
                        type="button"
                        onClick={agregarPresentacion}
                        style={styles.addButton}
                    >
                        <FaPlus />
                        Agregar presentación
                    </button>
                )}
            </div>

            <div style={styles.body}>
                <div style={styles.info}>
                    Un mismo producto puede tener
                    diferentes presentaciones, por
                    ejemplo unidad, blíster, caja,
                    frasco o tubo. Cada presentación
                    podrá tener sus propios precios.
                </div>

                {presentaciones.length === 0 ? (
                    <div style={styles.empty}>
                        <FaBoxOpen
                            style={styles.emptyIcon}
                        />

                        <div>
                            <strong>
                                No hay presentaciones
                                agregadas
                            </strong>
                        </div>

                        <div
                            style={{
                                marginTop: "5px",
                                fontSize: "12px",
                            }}
                        >
                            Utiliza "Agregar presentación"
                            para registrar una.
                        </div>
                    </div>
                ) : (
                    presentaciones.map(
                        (presentacion, index) => (
                            <div
                                key={
                                    presentacion.id_presentacion_producto ||
                                    `presentacion-${index}`
                                }
                                style={styles.card}
                            >
                                <div
                                    style={
                                        styles.cardHeader
                                    }
                                >
                                    <div
                                        style={
                                            styles.cardTitleArea
                                        }
                                    >
                                        <div
                                            style={
                                                styles.numberBox
                                            }
                                        >
                                            {index + 1}
                                        </div>

                                        <div
                                            style={
                                                styles.cardTitle
                                            }
                                        >
                                            {presentacion.nombre ||
                                                `Presentación ${index + 1
                                                }`}
                                        </div>

                                        {presentacion.estado ===
                                            "ACTIVO" && (
                                                <span
                                                    style={
                                                        styles.badge
                                                    }
                                                >
                                                    ACTIVO
                                                </span>
                                            )}
                                    </div>

                                    {!disabled && (
                                        <button
                                            type="button"
                                            title="Eliminar presentación"
                                            onClick={() =>
                                                eliminarPresentacion(
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

                                {/* FILA 1 */}

                                <div style={styles.row}>
                                    {/* WIDTH NOMBRE */}
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
                                            Nombre
                                            <span
                                                style={
                                                    styles.required
                                                }
                                            >
                                                *
                                            </span>
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                presentacion.nombre ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "nombre",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Ej. Caja de 20 tabletas"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* WIDTH TIPO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "100px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Tipo
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
                                                presentacion.tipo ||
                                                "UNIDAD"
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "tipo",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.select
                                            }
                                        >
                                            {TIPOS_PRESENTACION.map(
                                                (
                                                    tipo
                                                ) => (
                                                    <option
                                                        key={
                                                            tipo.value
                                                        }
                                                        value={
                                                            tipo.value
                                                        }
                                                    >
                                                        {
                                                            tipo.label
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    {/* WIDTH UNIDADES BASE */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "90px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Unidades base
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
                                            min="1"
                                            step="1"
                                            value={
                                                presentacion.unidades_base ??
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "unidades_base",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="1"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* WIDTH ESTADO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "100px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Estado
                                        </label>

                                        <select
                                            value={
                                                presentacion.estado ||
                                                "ACTIVO"
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "estado",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            style={
                                                styles.select
                                            }
                                        >
                                            <option value="ACTIVO">
                                                Activo
                                            </option>

                                            <option value="INACTIVO">
                                                Inactivo
                                            </option>
                                        </select>
                                    </div>

                                    {/* WIDTH SKU */}
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
                                            SKU
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                presentacion.sku ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "sku",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="SKU interno"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                    {/* WIDTH CÓDIGO DE BARRAS */}
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
                                            Código de barras
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                presentacion.codigo_barras ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "codigo_barras",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="GTIN / EAN / UPC"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                </div>

                                {/* FILA 2 */}

                                <div style={styles.row}>
                                    {/* WIDTH CONTENIDO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "100px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Contenido
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                presentacion.contenido ??
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "contenido",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Ej. 500"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>

                                    {/* WIDTH UNIDAD CONTENIDO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "130px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Unidad de contenido
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                presentacion.unidad_contenido ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "unidad_contenido",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="mg, ml, g..."
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                    {/* WIDTH PESO */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "130px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Peso en gramos
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                presentacion.peso_gramos ??
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "peso_gramos",
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
                                    {/* WIDTH FORMA FARMACÉUTICA */}
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
                                            Forma farmacéutica
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                presentacion.forma_farmaceutica ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "forma_farmaceutica",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Tableta, cápsula, jarabe..."
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                    {/* WIDTH CONCENTRACIÓN */}
                                    <div
                                        style={{
                                            ...styles.field,
                                            width: "280px",
                                        }}
                                    >
                                        <label
                                            style={
                                                styles.label
                                            }
                                        >
                                            Concentración
                                        </label>

                                        <input
                                            type="text"
                                            value={
                                                presentacion.concentracion_descriptiva ||
                                                ""
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "concentracion_descriptiva",
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            placeholder="Ej. 500 mg"
                                            style={
                                                styles.input
                                            }
                                        />
                                    </div>
                                </div>

                                {/* FILA 4 */}
                                <div
                                    style={
                                        styles.switches
                                    }
                                >
                                    <label
                                        style={
                                            styles.checkContainer
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                presentacion.permite_venta ??
                                                true
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "permite_venta",
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
                                            Permitir venta
                                        </span>
                                    </label>

                                    <label
                                        style={
                                            styles.checkContainer
                                        }
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                presentacion.permite_fraccionamiento ??
                                                false
                                            }
                                            disabled={
                                                disabled
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                modificarPresentacion(
                                                    index,
                                                    "permite_fraccionamiento",
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
                                            Permitir
                                            fraccionamiento
                                        </span>
                                    </label>
                                </div>
                            </div>
                        )
                    )
                )}
            </div>
        </section>
    );
};

export default PresentacionesProducto;