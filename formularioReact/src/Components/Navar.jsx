import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Carrito from './Carrito'
import '../Styles/Navar.css'

function Navar() {
    const [rol, setRol] = useState(null)
    const [nombre, setNombre] = useState("")
    const [carrito, setCarrito] = useState([])
    const [isCarritoOpen, setIsCarritoOpen] = useState(false)
    const navigate = useNavigate()

    const cargarDatos = () => {
        const rolGuardado = localStorage.getItem('rol');
        const nombreGuardado = localStorage.getItem('nombre');
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
        
        if (rolGuardado) {
            setRol(rolGuardado);
            setNombre(nombreGuardado);
        } else {
            setRol(null);
            setNombre("");
        }
        setCarrito(carritoGuardado);
    }

    useEffect(() => {
        cargarDatos();

        // Escuchar cambios en el carrito desde otros componentes
        const handleCartUpdate = () => {
            const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
            setCarrito(carritoGuardado);
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, [])

    const handleCerrarSesion = () => {
        localStorage.removeItem('rol');
        localStorage.removeItem('nombre');
        localStorage.removeItem('id');
        localStorage.removeItem('correo');
        localStorage.removeItem('carrito'); // Opcional: limpiar carrito al salir
        setRol(null);
        setNombre("");
        setCarrito([]);
        navigate('/');
    }

    const updateCantidad = (id, delta) => {
        const nuevoCarrito = carrito.map(item => {
            if (item.id === id) {
                const nuevaCant = Math.max(1, item.cantidad + delta);
                return { ...item, cantidad: nuevaCant };
            }
            return item;
        });
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);
    }

    const eliminarItem = (id) => {
        const nuevoCarrito = carrito.filter(item => item.id !== id);
        localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
        setCarrito(nuevoCarrito);
    }

    const handleFinalizarCompra = () => {
        if (carrito.length === 0) return;

        const userId = localStorage.getItem('id');
        if (!userId) return;

        // Calcular total para el ticket
        const total = carrito.reduce((acc, item) => {
            const precioLimpio = parseInt(item.precio.replace(/[^0-9]/g, "")) || 0;
            return acc + (precioLimpio * item.cantidad);
        }, 0);

        // Crear objeto de ticket
        const nuevoTicket = {
            id: Date.now(),
            fecha: new Date().toLocaleString(),
            items: carrito,
            total: total
        };

        // Guardar en historial (localStorage)
        const historialKey = `tickets_${userId}`;
        const historialActual = JSON.parse(localStorage.getItem(historialKey)) || [];
        localStorage.setItem(historialKey, JSON.stringify([nuevoTicket, ...historialActual]));

        // Limpiar carrito
        localStorage.removeItem('carrito');
        setCarrito([]);
        setIsCarritoOpen(false);

        // Notificar a otros componentes (si es necesario)
        window.dispatchEvent(new Event('cartUpdated'));
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        JOVI TECNOLOGIA AL ALCANCE
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item">
                                <Link className="nav-link" aria-current="page" to="/Productos">
                                    PRODUCTOS
                                </Link>
                            </li>
                            {rol === 'admin' && (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/Usuarios">
                                            USUARIOS
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/Administradores">
                                            ADMINISTRADORES
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/Tickets">
                                            TICKETS
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                        <div className="d-flex align-items-center">
                            {rol ? (
                                <>
                                    {rol === 'usuario' && (
                                        <div className="cart-icon-wrapper me-3" onClick={() => setIsCarritoOpen(true)} style={{cursor: 'pointer', position: 'relative'}}>
                                            <span style={{fontSize: '1.4rem'}}>🛒</span>
                                            {carrito.length > 0 && (
                                                <span className="badge bg-danger rounded-pill" style={{position: 'absolute', top: '-5px', right: '-10px', fontSize: '0.7rem'}}>
                                                    {carrito.reduce((acc, item) => acc + item.cantidad, 0)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    {/* Perfil link removed as requested */}

                                    <Link 
                                        to="/Perfil" 
                                        className={`btn btn-outline-${rol === 'admin' ? 'info' : 'success'} btn-sm me-3`}
                                    >
                                        Hola, {nombre} [{rol === 'admin' ? 'Admin' : 'Usuario'}]
                                    </Link>




                                    <button className="btn btn-outline-danger btn-sm" onClick={handleCerrarSesion}>
                                        Cerrar Sesión
                                    </button>
                                </>
                            ) : (
                                <Link to="/" className="btn btn-outline-success btn-sm">
                                    Iniciar Sesión / Registro
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <Carrito 
                items={carrito} 
                isOpen={isCarritoOpen} 
                onClose={() => setIsCarritoOpen(false)}
                onUpdateCantidad={updateCantidad}
                onEliminarItem={eliminarItem}
                onFinalizar={handleFinalizarCompra}
            />
        </>
    )
}
export default Navar