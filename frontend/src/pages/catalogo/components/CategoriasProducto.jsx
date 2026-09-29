import { FaTags, FaStar } from "react-icons/fa";

const CategoriasProducto = ({
    categorias = [],
    seleccionadas = [],
    onChange,
    disabled = false,
}) => {
    const estaSeleccionada = (idCategoria) =>
        seleccionadas.some(
            (item) =>
                Number(item.id_categoria) === Number(idCategoria)
        );

    const obtenerSeleccion = (idCategoria) =>
        seleccionadas.find(
            (item) =>
                Number(item.id_categoria) === Number(idCategoria)
        );

    const seleccionarCategoria = (categoria) => {
        if (disabled) return;

        const idCategoria = categoria.id_categoria;

        if (estaSeleccionada(idCategoria)) {
            const nuevas = seleccionadas.filter(
                (item) =>
                    Number(item.id_categoria) !==
                    Number(idCategoria)
            );

            /*
             * Si se elimina la categoría principal y todavía quedan
             * categorías seleccionadas, la primera pasa a ser principal.
             */
            const eliminada = obtenerSeleccion(idCategoria);

            if (
                eliminada?.principal &&
                nuevas.length > 0
            ) {
                nuevas[0] = {
                    ...nuevas[0],
                    principal: true,
                };
            }

            onChange(nuevas);
            return;
        }

        onChange([
            ...seleccionadas,
            {
                id_categoria: idCategoria,
                principal: seleccionadas.length === 0,
            },
        ]);
    };

    const establecerPrincipal = (
        event,
        idCategoria
    ) => {
        event.stopPropagation();

        if (
            disabled ||
            !estaSeleccionada(idCategoria)
        ) {
            return;
        }

        onChange(
            seleccionadas.map((item) => ({
                ...item,
                principal:
                    Number(item.id_categoria) ===
                    Number(idCategoria),
            }))
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

        counter: {
            backgroundColor: "#f1f7f4",
            color: "#159447",
            borderRadius: "20px",
            padding: "7px 12px",
            fontSize: "12px",
            fontWeight: "700",
            whiteSpace: "nowrap",
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

        grid: {
            display: "grid",
            gridTemplateColumns:
                "repeat(auto-fill, minmax(230px, 1fr))",
            gap: "12px",
        },

        card: {
            border: "1px solid #dfeae6",
            borderRadius: "11px",
            padding: "14px",
            cursor: disabled
                ? "default"
                : "pointer",
            transition: "0.15s ease",
            minHeight: "72px",
            boxSizing: "border-box",
        },

        cardSelected: {
            border: "1px solid #159447",
            backgroundColor: "#f0faf4",
        },

        cardTop: {
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "10px",
        },

        categoryInfo: {
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            flex: 1,
        },

        checkbox: {
            width: "17px",
            height: "17px",
            marginTop: "2px",
            accentColor: "#159447",
            cursor: disabled
                ? "default"
                : "pointer",
        },

        categoryName: {
            color: "#082b4f",
            fontSize: "13px",
            fontWeight: "700",
            lineHeight: "1.35",
        },

        categoryDescription: {
            color: "#81918c",
            fontSize: "11px",
            marginTop: "4px",
            lineHeight: "1.35",
        },

        principalButton: {
            border: "none",
            width: "31px",
            height: "31px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: disabled
                ? "default"
                : "pointer",
            flexShrink: 0,
        },

        principalActive: {
            backgroundColor: "#159447",
            color: "#ffffff",
        },

        principalInactive: {
            backgroundColor: "#eef3f1",
            color: "#9aa9a4",
        },

        badgePrincipal: {
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            marginTop: "10px",
            padding: "4px 8px",
            borderRadius: "15px",
            backgroundColor: "#eaf7f0",
            color: "#159447",
            fontSize: "10px",
            fontWeight: "700",
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
    };

    return (
        <section style={styles.section}>
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <div style={styles.iconBox}>
                        <FaTags />
                    </div>

                    <div>
                        <h2 style={styles.title}>
                            Categorías
                        </h2>

                        <p style={styles.subtitle}>
                            Clasificación del producto dentro
                            del catálogo.
                        </p>
                    </div>
                </div>

                <div style={styles.counter}>
                    {seleccionadas.length}{" "}
                    {seleccionadas.length === 1
                        ? "seleccionada"
                        : "seleccionadas"}
                </div>
            </div>

            <div style={styles.body}>
                <div style={styles.info}>
                    Puedes asignar varias categorías al
                    producto. Utiliza la estrella para
                    indicar cuál será la categoría principal.
                </div>

                {categorias.length === 0 ? (
                    <div style={styles.empty}>
                        <FaTags
                            style={styles.emptyIcon}
                        />

                        <div>
                            <strong>
                                No hay categorías disponibles
                            </strong>
                        </div>

                        <div
                            style={{
                                fontSize: "12px",
                                marginTop: "5px",
                            }}
                        >
                            Las categorías registradas
                            aparecerán aquí.
                        </div>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {categorias.map((categoria) => {
                            const seleccionada =
                                estaSeleccionada(
                                    categoria.id_categoria
                                );

                            const seleccion =
                                obtenerSeleccion(
                                    categoria.id_categoria
                                );

                            const principal =
                                seleccion?.principal === true;

                            return (
                                <div
                                    key={
                                        categoria.id_categoria
                                    }
                                    onClick={() =>
                                        seleccionarCategoria(
                                            categoria
                                        )
                                    }
                                    style={{
                                        ...styles.card,
                                        ...(seleccionada
                                            ? styles.cardSelected
                                            : {}),
                                    }}
                                >
                                    <div
                                        style={
                                            styles.cardTop
                                        }
                                    >
                                        <div
                                            style={
                                                styles.categoryInfo
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={
                                                    seleccionada
                                                }
                                                readOnly
                                                disabled={
                                                    disabled
                                                }
                                                style={
                                                    styles.checkbox
                                                }
                                            />

                                            <div>
                                                <div
                                                    style={
                                                        styles.categoryName
                                                    }
                                                >
                                                    {
                                                        categoria.nombre
                                                    }
                                                </div>

                                                {categoria.descripcion && (
                                                    <div
                                                        style={
                                                            styles.categoryDescription
                                                        }
                                                    >
                                                        {
                                                            categoria.descripcion
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {seleccionada && (
                                            <button
                                                type="button"
                                                title={
                                                    principal
                                                        ? "Categoría principal"
                                                        : "Establecer como principal"
                                                }
                                                disabled={
                                                    disabled
                                                }
                                                onClick={(
                                                    event
                                                ) =>
                                                    establecerPrincipal(
                                                        event,
                                                        categoria.id_categoria
                                                    )
                                                }
                                                style={{
                                                    ...styles.principalButton,
                                                    ...(principal
                                                        ? styles.principalActive
                                                        : styles.principalInactive),
                                                }}
                                            >
                                                <FaStar />
                                            </button>
                                        )}
                                    </div>

                                    {principal && (
                                        <div
                                            style={
                                                styles.badgePrincipal
                                            }
                                        >
                                            <FaStar />
                                            Categoría principal
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoriasProducto;