import React, { useState, useEffect } from 'react';
import ServiceProductos from '../Services/ServiceProductos';
import FormManejoProductos from './FormManejoProductos';
import '../Styles/Productos.css';

function Productos() {
    const [productos, setProductos] = useState([]);
    const [rol, setRol] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [mensajeAdquisicion, setMensajeAdquisicion] = useState("");

    const fetchProductos = async () => {
        const data = await ServiceProductos.getProductos();
        if (data) {
            setProductos(data);
        }
    };

    useEffect(() => {
        // Verificar rol
        const rolGuardado = localStorage.getItem("rol");
        if (rolGuardado) {
            setRol(rolGuardado);
        }

        // Cargar productos
        fetchProductos();
    }, []);

    // Funciones CRUD para admin
    async function handleEliminar(id) {
        if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
            const borrado = await ServiceProductos.deleteProductos(id);
            if (borrado) {
                // Refrescar lista
                fetchProductos();
            } else {
                setMensajeAdquisicion("Error al eliminar el producto ❌");
                setTimeout(() => setMensajeAdquisicion(""), 3000);
            }
        }
    }

    function handleAgregar() {
        setProductoAEditar(null);
        setMostrarFormulario(true);
    }

    function handleEditar(producto) {
        setProductoAEditar(producto);
        setMostrarFormulario(true);
    }

    const handleComprar = (producto) => {
        const carritoActual = JSON.parse(localStorage.getItem('carrito')) || [];
        const itemExistente = carritoActual.find(item => item.id === producto.id);

        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carritoActual.push({ ...producto, cantidad: 1 });
        }

        localStorage.setItem('carrito', JSON.stringify(carritoActual));
        
        // Notificar al Navbar que el carrito cambió
        window.dispatchEvent(new Event('cartUpdated'));

        // Mensaje en pantalla solicitado por el usuario
        setMensajeAdquisicion(`¡Producto "${producto.nombre}" adquirido!`);
        
        // Quitar el mensaje después de 3 segundos
        setTimeout(() => {
            setMensajeAdquisicion("");
        }, 3000);
    };

    return (
        <div className="productos-container">
            <h2 className="productos-titulo">Nuestro Catálogo Tecnológico</h2>

            {/* Notificación de éxito */}
            {mensajeAdquisicion && (
                <div style={{
                    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#04fd9e', color: '#000', padding: '15px 30px',
                    borderRadius: '50px', fontWeight: 'bold', zIndex: 3000,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.3)', animation: 'slideUp 0.3s ease'
                }}>
                    {mensajeAdquisicion}
                </div>
            )}
            
            {/* Si es admin, mostrar botón de agregar */}
            {rol === 'admin' && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <button onClick={handleAgregar} className="btn-comprar" style={{backgroundColor: '#fd7404', color: '#fff', borderColor: '#fd7404'}}>
                        + Agregar Nuevo Producto
                    </button>
                </div>
            )}

            {/* Formulario Modal para Admin */}
            {mostrarFormulario && (
                <FormManejoProductos 
                    productoAEditar={productoAEditar}
                    onCerrar={() => setMostrarFormulario(false)}
                    onGuardado={fetchProductos}
                />
            )}

            <div className="productos-grid">
                {productos.map((producto) => (
                    <div className="producto-card" key={producto.id}>
                        <div className="producto-imagen-wrapper">
                            <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
                            <span className="producto-categoria">{producto.categoria}</span>
                        </div>
                        <div className="producto-info">
                            <h3 className="producto-nombre">{producto.nombre}</h3>
                            <p className="producto-descripcion">{producto.descripcion}</p>
                            <div className="producto-footer">
                                <span className="producto-precio">₡{producto.precio}</span>
                                
                                {/* Renderizado Condicional del Botón según Rol */}
                                {rol === 'admin' ? (
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        <button className="btn-comprar" onClick={() => handleEditar(producto)}>Editar</button>
                                        <button className="btn-comprar" style={{borderColor: 'red', color: 'red'}} onClick={() => handleEliminar(producto.id)}>Eliminar</button>
                                    </div>
                                ) : rol === 'usuario' ? (
                                    <button className="btn-comprar" onClick={() => handleComprar(producto)}>Comprar</button>
                                ) : (
                                    <span style={{ fontSize: '0.8rem', color: '#aaaaaa' }}>Inicia sesión para adquirir</span>
                                )}

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Productos;
