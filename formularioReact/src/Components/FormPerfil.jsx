import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceUsuarios from '../Services/ServiceUsuarios';
import Navar from './Navar';

// Reusing existing styles for total consistency
import '../Styles/Home.css';
import '../Styles/FormUsuarios.css';
import '../Styles/Perfil.css';

function FormPerfil() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [id, setId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedId = localStorage.getItem('id');
        const storedNombre = localStorage.getItem('nombre');
        const storedCorreo = localStorage.getItem('correo');
        const rol = localStorage.getItem('rol');

        if (!storedId || rol !== 'usuario') {
            navigate('/');
            return;
        }

        setId(storedId);
        setNombre(storedNombre || "");
        setCorreo(storedCorreo || "");

        // Cargar historial de tickets
        const historialKey = `tickets_${storedId}`;
        const historial = JSON.parse(localStorage.getItem(historialKey)) || [];
        setTickets(historial);

        const fetchUserData = async () => {
            const usuarios = await ServiceUsuarios.getUsuarios();
            const user = usuarios?.find(u => u.id === storedId);
            if (user) {
                setContraseña(user.Contraseña);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!nombre || !correo || !contraseña) {
            setMensaje("Todos los campos son obligatorios");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        const updatedUser = {
            id: id,
            Nombre: nombre,
            Correo: correo,
            Contraseña: contraseña
        };

        const result = await ServiceUsuarios.putUsuarios(updatedUser, id);

        if (result) {
            localStorage.setItem('nombre', nombre);
            localStorage.setItem('correo', correo);
            setMensaje("Perfil actualizado con éxito ✅");

            // Dispatch events to update UI
            window.dispatchEvent(new Event('storage'));
            window.dispatchEvent(new Event('cartUpdated'));
        } else {
            setMensaje("Error al actualizar el perfil ❌");
        }

        setTimeout(() => setMensaje(""), 3000);
    };

    const handleEliminarTicket = (ticketId) => {
        if (window.confirm("¿Deseas eliminar este ticket del historial?")) {
            const historialKey = `tickets_${id}`;
            const historialActual = JSON.parse(localStorage.getItem(historialKey)) || [];
            const nuevoHistorial = historialActual.filter(t => t.id !== ticketId);

            localStorage.setItem(historialKey, JSON.stringify(nuevoHistorial));
            setTickets(nuevoHistorial);

            // Dispatch event to notify other components (like Admin view)
            window.dispatchEvent(new Event('ticketsUpdated'));
        }
    };

    return (
        <div className="home-container">
            <Navar />

            <div className="formularios-container">
                <div className="formulario-wrapper">
                    {/* Using the same class as FormUsuarios for exact match */}
                    <div className="datosUsuario">
                        <h1>MI PERFIL DE USUARIO</h1>

                        <form onSubmit={handleUpdate}>
                            <h4>Nombre:</h4>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Tu nombre"
                            />

                            <h4>Correo Electrónico:</h4>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="tu@correo.com"
                            />

                            <h4>Contraseña:</h4>
                            <input
                                type="password"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                placeholder="Nueva contraseña"
                            />

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="submit">Guardar Cambios</button>
                                <button type="button" onClick={() => navigate('/Productos')}>Regresar</button>
                            </div>
                        </form>

                        {mensaje && (
                            <h4 style={{
                                marginTop: '15px',
                                color: mensaje.includes('éxito') ? '#04fd9e' : '#ff4444',
                                textAlign: 'center'
                            }}>
                                {mensaje}
                            </h4>
                        )}
                    </div>
                </div>

                {/* Sección de Historial de Compras (Tickets) */}
                <div className="formulario-wrapper" style={{ marginTop: '0' }}>
                    <div className="datosUsuario" style={{ minHeight: '100%' }}>
                        <h1 style={{ color: '#04fd9e' }}>MIS COMPRAS 🛒</h1>

                        {tickets.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                                Aún no has realizado ninguna compra.
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        border: '1px solid rgba(4, 253, 158, 0.2)',
                                        borderRadius: '15px',
                                        padding: '15px',
                                        fontSize: '0.9rem'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(4, 253, 158, 0.2)', paddingBottom: '8px', marginBottom: '10px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ color: '#04fd9e', fontWeight: 'bold' }}>TICKET #{ticket.id.toString().slice(-6)}</span>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    color: ticket.entregado ? '#04fd9e' : '#fd7404',
                                                    fontWeight: 'bold',
                                                    marginTop: '2px'
                                                }}>
                                                    {ticket.entregado ? 'ESTADO: ENTREGADO ✅' : 'ESTADO: PENDIENTE ⏳'}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span style={{ color: '#888' }}>{ticket.fecha}</span>
                                                <button
                                                    onClick={() => handleEliminarTicket(ticket.id)}
                                                    style={{
                                                        background: 'transparent', border: 'none', color: '#ff4444',
                                                        cursor: 'pointer', padding: '0 5px', fontSize: '1rem',
                                                        transition: 'transform 0.2s'
                                                    }}
                                                    title="Eliminar Ticket"
                                                    onMouseOver={(e) => e.target.style.transform = 'scale(1.2)'}
                                                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{ marginBottom: '10px' }}>
                                            {ticket.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                                    <span>{item.cantidad}x {item.nombre}</span>
                                                    <span>₡{item.precio}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: '8px', marginTop: '5px', fontWeight: 'bold' }}>
                                            <span>TOTAL PAGADO:</span>
                                            <span style={{ color: '#04fd9e' }}>
                                                ₡{new Intl.NumberFormat('es-CR').format(ticket.total)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormPerfil;
