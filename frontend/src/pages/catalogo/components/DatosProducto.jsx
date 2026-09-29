import { FaInfoCircle } from "react-icons/fa";

const DatosProducto = ({
    datos,
    onChange,
    marcas = [],
    laboratorios = [],
    disabled = false,
}) => {
    const tiposProducto = [
        { value: "MEDICAMENTO", label: "Medicamento" },
        { value: "CUIDADO_PERSONAL", label: "Cuidado personal" },
        { value: "DISPOSITIVO", label: "Dispositivo" },
        { value: "SUPLEMENTO", label: "Suplemento" },
        { value: "OTRO", label: "Otro" },
    ];

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        onChange({
            ...datos,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const styles = {
        section: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2ebe7",
            borderRadius: "15px",
            overflow: "hidden",
            boxShadow: "0 7px 20px rgba(17,48,65,0.06)",
            marginBottom: "20px",
        },

        header: {
            padding: "17px 22px",
            borderBottom: "1px solid #edf2f0",
            backgroundColor: "#ffffff",
        },

        title: {
            margin: 0,
            color: "#082b4f",
            fontSize: "18px",
            fontWeight: "700",
        },

        subtitle: {
            margin: "4px 0 0",
            color: "#7a8984",
            fontSize: "12px",
        },

        body: {
            padding: "18px 22px 20px",
        },

        // CADA FILA ES INDEPENDIENTE
        row: {
            display: "flex",
            alignItems: "flex-start",
            gap: "16px",
            marginBottom: "14px",
            width: "100%",
        },

        field: {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
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
            borderRadius: "8px",
            padding: "9px 10px",
            fontSize: "13px",
            color: "#243b53",
            backgroundColor: disabled ? "#f5f7f6" : "#ffffff",
            outline: "none",
        },

        select: {
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #dfeae6",
            borderRadius: "8px",
            padding: "9px 10px",
            fontSize: "13px",
            color: "#243b53",
            backgroundColor: disabled ? "#f5f7f6" : "#ffffff",
            outline: "none",
        },

        textarea: {
            width: "100%",
            boxSizing: "border-box",
            border: "1px solid #dfeae6",
            borderRadius: "8px",
            padding: "9px 10px",
            fontSize: "13px",
            color: "#243b53",
            backgroundColor: disabled ? "#f5f7f6" : "#ffffff",
            outline: "none",
            resize: "none",
            height: "48px",
            minHeight: "48px",
            fontFamily: "'Segoe UI', sans-serif",
        },

        help: {
            color: "#81918c",
            fontSize: "10px",
            marginTop: "0px",
        },

        checksContainer: {
            display: "flex",
            gap: "12px",
            width: "100%",
        },

        checkCard: {
            width: "260px",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "10px 12px",
            border: "1px solid #dfeae6",
            borderRadius: "9px",
            backgroundColor: "#f8fbfa",
            cursor: disabled ? "default" : "pointer",
        },

        checkbox: {
            width: "16px",
            height: "16px",
            flexShrink: 0,
            accentColor: "#159447",
            cursor: disabled ? "default" : "pointer",
        },

        checkText: {
            display: "flex",
            flexDirection: "column",
            gap: "1px",
        },

        checkTitle: {
            color: "#082b4f",
            fontSize: "12px",
            fontWeight: "700",
        },

        checkDescription: {
            color: "#7a8984",
            fontSize: "10px",
            lineHeight: "1.3",
        },
    };

    return (
        <section style={styles.section}>
            <div
                style={{
                    ...styles.header,
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                }}
            >
                <div
                    style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        backgroundColor: "#eaf7f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <FaInfoCircle
                        style={{
                            color: "#159447",
                            fontSize: "17px",
                        }}
                    />
                </div>

                <div>
                    <h2 style={styles.title}>
                        Información del producto
                    </h2>

                    <p style={styles.subtitle}>
                        Datos generales y configuración comercial del producto.
                    </p>
                </div>
            </div>

            <div style={styles.body}>

                {/* =====================================================
                    FILA 1
                    NOMBRE | SLUG | TIPO | ESTADO
                ===================================================== */}

                <div style={styles.row}>

                    {/* WIDTH NOMBRE */}
                    <div
                        style={{
                            ...styles.field,
                            width: "300px",
                        }}
                    >
                        <label style={styles.label}>
                            Nombre del producto
                            <span style={styles.required}>*</span>
                        </label>

                        <input
                            type="text"
                            name="nombre"
                            value={datos.nombre || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Ej. Acetaminofén 500 mg"
                            style={styles.input}
                        />
                    </div>

                    {/* WIDTH SLUG */}
                    <div
                        style={{
                            ...styles.field,
                            width: "280px",
                        }}
                    >
                        <label style={styles.label}>
                            Slug
                            <span style={styles.required}>*</span>
                        </label>

                        <input
                            type="text"
                            name="slug"
                            value={datos.slug || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="acetaminofen-500-mg"
                            style={styles.input}
                        />

                        <span style={styles.help}>
                            Identificador utilizado en la web.
                        </span>
                    </div>

                    {/* WIDTH TIPO */}
                    <div
                        style={{
                            ...styles.field,
                            width: "190px",
                        }}
                    >
                        <label style={styles.label}>
                            Tipo de producto
                            <span style={styles.required}>*</span>
                        </label>

                        <select
                            name="tipo"
                            value={datos.tipo || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            style={styles.select}
                        >
                            <option value="">
                                Seleccione un tipo
                            </option>

                            {tiposProducto.map((tipo) => (
                                <option
                                    key={tipo.value}
                                    value={tipo.value}
                                >
                                    {tipo.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* WIDTH ESTADO */}
                    <div
                        style={{
                            ...styles.field,
                            width: "180px",
                        }}
                    >
                        <label style={styles.label}>
                            Estado de publicación
                        </label>

                        <select
                            name="estado"
                            value={datos.estado || "BORRADOR"}
                            onChange={handleChange}
                            disabled={disabled}
                            style={styles.select}
                        >
                            <option value="BORRADOR">
                                Borrador
                            </option>

                            <option value="PUBLICADO">
                                Publicado
                            </option>

                            <option value="ARCHIVADO">
                                Archivado
                            </option>
                        </select>
                    </div>
                </div>

                {/* =====================================================
                    FILA 2
                    UNIDAD | MARCA | LABORATORIO | REGISTRO
                ===================================================== */}

                <div style={styles.row}>

                    {/* WIDTH UNIDAD BASE */}
                    <div
                        style={{
                            ...styles.field,
                            width: "250px",
                        }}
                    >
                        <label style={styles.label}>
                            Unidad base
                            <span style={styles.required}>*</span>
                        </label>

                        <input
                            type="text"
                            name="unidad_base"
                            value={datos.unidad_base || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Ej. unidad, tableta, ml"
                            style={styles.input}
                        />
                    </div>

                    {/* WIDTH MARCA */}
                    <div
                        style={{
                            ...styles.field,
                            width: "200px",
                        }}
                    >
                        <label style={styles.label}>
                            Marca
                        </label>

                        <select
                            name="id_marca"
                            value={datos.id_marca || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            style={styles.select}
                        >
                            <option value="">
                                Sin marca asignada
                            </option>

                            {marcas.map((marca) => (
                                <option
                                    key={marca.id_marca}
                                    value={marca.id_marca}
                                >
                                    {marca.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* WIDTH LABORATORIO */}
                    <div
                        style={{
                            ...styles.field,
                            width: "220px",
                        }}
                    >
                        <label style={styles.label}>
                            Laboratorio
                        </label>

                        <select
                            name="id_laboratorio"
                            value={datos.id_laboratorio || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            style={styles.select}
                        >
                            <option value="">
                                Sin laboratorio asignado
                            </option>

                            {laboratorios.map((laboratorio) => (
                                <option
                                    key={laboratorio.id_laboratorio}
                                    value={laboratorio.id_laboratorio}
                                >
                                    {laboratorio.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* WIDTH REGISTRO SANITARIO */}
                    <div
                        style={{
                            ...styles.field,
                            width: "210px",
                        }}
                    >
                        <label style={styles.label}>
                            Registro sanitario
                        </label>

                        <input
                            type="text"
                            name="registro_sanitario"
                            value={datos.registro_sanitario || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Número de registro"
                            style={styles.input}
                        />
                    </div>
                </div>

                {/* =====================================================
                    FILA 3
                    DESCRIPCIÓN CORTA | DESCRIPCIÓN COMPLETA
                ===================================================== */}

                <div style={styles.row}>

                    {/* WIDTH DESCRIPCIÓN CORTA */}
                    <div
                        style={{
                            ...styles.field,
                            width: "420px",
                        }}
                    >
                        <label style={styles.label}>
                            Descripción corta
                        </label>

                        <textarea
                            name="descripcion_corta"
                            value={datos.descripcion_corta || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Descripción breve del producto..."
                            style={styles.textarea}
                        />
                    </div>

                    {/* WIDTH DESCRIPCIÓN COMPLETA */}
                    <div
                        style={{
                            ...styles.field,
                            width: "520px",
                        }}
                    >
                        <label style={styles.label}>
                            Descripción completa
                        </label>

                        <textarea
                            name="descripcion_larga"
                            value={datos.descripcion_larga || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Información detallada del producto..."
                            style={styles.textarea}
                        />
                    </div>
                </div>

                {/* =====================================================
                    FILA 4
                    CONSERVACIÓN | ADVERTENCIAS
                ===================================================== */}

                <div style={styles.row}>

                    {/* WIDTH CONSERVACIÓN */}
                    <div
                        style={{
                            ...styles.field,
                            width: "420px",
                        }}
                    >
                        <label style={styles.label}>
                            Conservación
                        </label>

                        <textarea
                            name="conservacion"
                            value={datos.conservacion || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Condiciones de almacenamiento..."
                            style={styles.textarea}
                        />
                    </div>

                    {/* WIDTH ADVERTENCIAS */}
                    <div
                        style={{
                            ...styles.field,
                            width: "520px",
                        }}
                    >
                        <label style={styles.label}>
                            Advertencias
                        </label>

                        <textarea
                            name="advertencias"
                            value={datos.advertencias || ""}
                            onChange={handleChange}
                            disabled={disabled}
                            placeholder="Advertencias generales del producto..."
                            style={styles.textarea}
                        />
                    </div>
                </div>

                {/* =====================================================
                    FILA 5
                    OPCIONES
                ===================================================== */}

                <div
                    style={{
                        ...styles.row,
                        marginBottom: 0,
                    }}
                >
                    <div style={styles.checksContainer}>

                        <label style={styles.checkCard}>
                            <input
                                type="checkbox"
                                name="requiere_receta"
                                checked={datos.requiere_receta || false}
                                onChange={handleChange}
                                disabled={disabled}
                                style={styles.checkbox}
                            />

                            <span style={styles.checkText}>
                                <span style={styles.checkTitle}>
                                    Requiere receta
                                </span>

                                <span style={styles.checkDescription}>
                                    Requiere receta médica.
                                </span>
                            </span>
                        </label>

                        <label style={styles.checkCard}>
                            <input
                                type="checkbox"
                                name="visible_web"
                                checked={datos.visible_web || false}
                                onChange={handleChange}
                                disabled={disabled}
                                style={styles.checkbox}
                            />

                            <span style={styles.checkText}>
                                <span style={styles.checkTitle}>
                                    Visible en web
                                </span>

                                <span style={styles.checkDescription}>
                                    Mostrar en catálogo público.
                                </span>
                            </span>
                        </label>

                        <label style={styles.checkCard}>
                            <input
                                type="checkbox"
                                name="destacado"
                                checked={datos.destacado || false}
                                onChange={handleChange}
                                disabled={disabled}
                                style={styles.checkbox}
                            />

                            <span style={styles.checkText}>
                                <span style={styles.checkTitle}>
                                    Producto destacado
                                </span>

                                <span style={styles.checkDescription}>
                                    Dar mayor relevancia al producto.
                                </span>
                            </span>
                        </label>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default DatosProducto;