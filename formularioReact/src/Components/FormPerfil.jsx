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

                            <div className="perfil-btn-group">
                                <button type="submit">Guardar Cambios</button>
                                <button type="button" onClick={() => navigate('/Productos')}>Regresar</button>
                            </div>
                        </form>

                        {mensaje && (
                            <h4 className={`perfil-mensaje ${mensaje.includes('éxito') ? 'mensaje-exito' : 'mensaje-error'}`}>
                                {mensaje}
                            </h4>
                        )}
                    </div>
                </div>

                {/* Sección de Historial de Compras (Tickets) */}
                <div className="formulario-wrapper tickets-section">
                    <div className="datosUsuario tickets-container">
                        <h1 className="status-delivered">MIS COMPRAS 🛒</h1>
                        
                        {tickets.length === 0 ? (
                            <p className="empty-tickets">
                                Aún no has realizado ninguna compra.
                            </p>
                        ) : (
                            <div className="tickets-scroll">
                                {tickets.map((ticket) => (
                                    <div key={ticket.id} className="ticket-card">
                                        <div className="ticket-header">
                                            <div className="ticket-id-group">
                                                <span className="ticket-id">TICKET #{ticket.id.toString().slice(-6)}</span>
                                                <span className={`ticket-status ${ticket.entregado ? 'status-delivered' : 'status-pending'}`}>
                                                    {ticket.entregado ? 'ESTADO: ENTREGADO ✅' : 'ESTADO: PENDIENTE ⏳'}
                                                </span>
                                            </div>
                                            <div className="ticket-meta">
                                                <span className="ticket-date">{ticket.fecha}</span>
                                                <button 
                                                    onClick={() => handleEliminarTicket(ticket.id)}
                                                    className="btn-delete-ticket"
                                                    title="Eliminar Ticket"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="ticket-items">
                                            {ticket.items.map((item, idx) => (
                                                <div key={idx} className="ticket-item-row">
                                                    <span>{item.cantidad}x {item.nombre}</span>
                                                    <span>₡{item.precio}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="ticket-total-row">
                                            <span>TOTAL PAGADO:</span>
                                            <span className="ticket-total-value">
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
