import React, { useState, useEffect } from 'react';
import ServiceProductos from '../Services/ServiceProductos';

function FormManejoProductos({ productoAEditar, onCerrar, onGuardado }) {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [imagen, setImagen] = useState("");
    const [categoria, setCategoria] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        if (productoAEditar) {
            setNombre(productoAEditar.nombre);
            setPrecio(productoAEditar.precio);
            setImagen(productoAEditar.imagen);
            setCategoria(productoAEditar.categoria);
            setDescripcion(productoAEditar.descripcion);
        }
    }, [productoAEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nombre || !precio || !imagen || !categoria || !descripcion) {
            setMensaje("Por favor, complete todos los campos.");
            return;
        }

        const datosProducto = {
            nombre,
            precio,
            imagen,
            categoria,
            descripcion
        };

        let resultado;
        if (productoAEditar) {
            resultado = await ServiceProductos.putProductos(datosProducto, productoAEditar.id);
        } else {
            // Generar un ID simple para el nuevo producto si el servicio no lo hace
            datosProducto.id = String(Date.now());
            resultado = await ServiceProductos.postProductos(datosProducto);
        }

        if (resultado) {
            onGuardado();
            onCerrar();
        } else {
            setMensaje("Hubo un error al procesar el producto.");
        }
    };

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center',
            alignItems: 'center', zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '15px',
                width: '90%', maxWidth: '500px', color: 'white', border: '1px solid #fd7404'
            }}>
                <h2 style={{ textAlign: 'center', color: '#fd7404' }}>
                    {productoAEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                </h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label>Nombre:</label>
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} 
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none' }} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <label>Precio:</label>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', paddingLeft: '10px' }}>
                            <span style={{ color: '#fd7404', fontWeight: 'bold' }}>₡</span>
                            <input 
                                type="text" 
                                placeholder="Ej: 500,000" 
                                value={precio} 
                                onChange={(e) => setPrecio(e.target.value)} 
                                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none', background: 'transparent', color: 'white' }} 
                            />
                        </div>
                    </div>
                    <div>
                        <label>URL Imagen:</label>
                        <input type="text" value={imagen} onChange={(e) => setImagen(e.target.value)} 
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none' }} />
                    </div>
                    <div>
                        <label>Categoría:</label>
                        <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} 
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none' }} />
                    </div>
                    <div>
                        <label>Descripción:</label>
                        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} 
                            style={{ width: '100%', padding: '8px', borderRadius: '5px', border: 'none', height: '80px' }} />
                    </div>

                    {mensaje && <p style={{ color: '#ff4d4d', fontSize: '0.9rem', textAlign: 'center' }}>{mensaje}</p>}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" onClick={onCerrar} 
                            style={{ padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', background: '#444', color: 'white', border: 'none' }}>
                            Cancelar
                        </button>
                        <button type="submit" 
                            style={{ padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', background: '#fd7404', color: 'white', border: 'none' }}>
                            {productoAEditar ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FormManejoProductos;
