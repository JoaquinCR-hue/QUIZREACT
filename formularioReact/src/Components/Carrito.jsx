import React, { useState } from 'react';
import '../Styles/Carrito.css';

function Carrito({ items, isOpen, onClose, onUpdateCantidad, onEliminarItem, onFinalizar }) {
    const [mensaje, setMensaje] = useState("");

    
    const calcularTotal = () => {
        return items.reduce((total, item) => {
            // Limpiar el formato de precio para el cálculo (ej: ₡1,200,000 -> 1200000)
            const precioLimpio = parseInt(item.precio.replace(/[^0-9]/g, "")) || 0;
            return total + (precioLimpio * item.cantidad);
        }, 0);
    };

    const formatearPrecio = (valor) => {
        return new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', minimumFractionDigits: 0 }).format(valor);
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="carrito-overlay" onClick={onClose}></div>
            <div className={`carrito-drawer ${isOpen ? 'open' : ''}`}>
                <div className="carrito-header">
                    <h2>Tu Carrito</h2>
                    <button className="btn-cerrar-carrito" onClick={onClose}>&times;</button>
                </div>

                <div className="carrito-items">
                    {items.length === 0 ? (
                        <p className="carrito-vacio">El carrito está vacío</p>
                    ) : (
                        items.map((item) => (
                            <div className="carrito-item" key={item.id}>
                                <img src={item.image || item.imagen} alt={item.nombre} className="carrito-item-img" />
                                <div className="carrito-item-info">
                                    <p className="carrito-item-nombre">{item.nombre}</p>
                                    <p className="carrito-item-precio">₡{item.precio}</p>
                                    <div className="carrito-item-acciones">
                                        <button className="btn-cantidad" onClick={() => onUpdateCantidad(item.id, -1)}>-</button>
                                        <span className="cantidad-valor">{item.cantidad}</span>
                                        <button className="btn-cantidad" onClick={() => onUpdateCantidad(item.id, 1)}>+</button>
                                        <button className="btn-eliminar-item" onClick={() => onEliminarItem(item.id)}>
                                            <i className="fa-solid fa-trash"></i> 🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="carrito-footer">
                    <div className="carrito-total">
                        <span>Total:</span>
                        <span className="total-valor">{formatearPrecio(calcularTotal())}</span>
                    </div>

                    {mensaje && (
                        <div style={{
                            backgroundColor: '#04fd9e', color: '#000', padding: '10px',
                            borderRadius: '8px', marginBottom: '15px', textAlign: 'center',
                            fontWeight: 'bold', fontSize: '0.9rem', animation: 'fadeIn 0.3s ease'
                        }}>
                            {mensaje}
                        </div>
                    )}

                    <button 
                        className="btn-finalizar-compra" 
                        disabled={items.length === 0}
                        onClick={() => {
                            setMensaje("¡Compra realizada con éxito! 🛒✅");
                            setTimeout(() => {
                                setMensaje("");
                                onFinalizar();
                            }, 2000);
                        }}
                    >
                        Finalizar Compra
                    </button>
                </div>
            </div>
        </>
    );
}

export default Carrito;
