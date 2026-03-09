import React, { useState, useEffect } from 'react';
import Navar from './Navar';
import '../Styles/GestionTickets.css';

function GestionTickets() {
    const [allTickets, setAllTickets] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const cargarTodosLosTickets = () => {
        const ticketsTemp = [];
        // Recorrer todas las llaves de localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('tickets_')) {
                const userTickets = JSON.parse(localStorage.getItem(key)) || [];
                const userId = key.replace('tickets_', '');
                
                // Agregar el userId a cada ticket para saber de quién es
                userTickets.forEach(ticket => {
                    ticketsTemp.push({ ...ticket, userId });
                });
            }
        }
        // Ordenar por fecha (más recientes primero)
        ticketsTemp.sort((a, b) => b.id - a.id);
        setAllTickets(ticketsTemp);
    };

    useEffect(() => {
        cargarTodosLosTickets();
    }, []);

    const toggleEntrega = (userId, ticketId) => {
        const key = `tickets_${userId}`;
        const userTickets = JSON.parse(localStorage.getItem(key)) || [];
        
        const nuevosTickets = userTickets.map(t => {
            if (t.id === ticketId) {
                return { ...t, entregado: !t.entregado };
            }
            return t;
        });

        localStorage.setItem(key, JSON.stringify(nuevosTickets));
        cargarTodosLosTickets(); // Refrescar vista
        setMensaje("Estado de entrega actualizado ✅");
        setTimeout(() => setMensaje(""), 3000);
    };

    return (
        <div className="gestion-container">
            <Navar />
            <div className="gestion-content">
                <h1 className="gestion-titulo">Gestión de Pedidos y Tickets</h1>
                
                {mensaje && (
                    <div className="gestion-alerta">
                        {mensaje}
                    </div>
                )}

                <div className="gestion-grid">
                    {allTickets.length === 0 ? (
                        <p className="gestion-vacio">No hay tickets registrados en el sistema.</p>
                    ) : (
                        allTickets.map((ticket) => (
                            <div key={`${ticket.userId}-${ticket.id}`} className={`ticket-admin-card ${ticket.entregado ? 'entregado' : ''}`}>
                                <div className="ticket-header">
                                    <div>
                                        <h3>ID: #{ticket.id.toString().slice(-6)}</h3>
                                        <p className="ticket-fecha">{ticket.fecha}</p>
                                    </div>
                                    <div className="status-label">
                                        {ticket.entregado ? 'ENTREGADO' : 'PENDIENTE'}
                                    </div>
                                </div>

                                <div className="ticket-body">
                                    <p className="user-info"><strong>Usuario ID:</strong> {ticket.userId}</p>
                                    <div className="items-list">
                                        {ticket.items.map((item, idx) => (
                                            <div key={idx} className="item-row">
                                                <span>{item.cantidad}x {item.nombre}</span>
                                                <span>₡{item.precio}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="ticket-footer">
                                    <div className="total-box">
                                        <span>TOTAL:</span>
                                        <span className="precio-total">₡{new Intl.NumberFormat('es-CR').format(ticket.total)}</span>
                                    </div>
                                    <label className="delivery-check">
                                        <input 
                                            type="checkbox" 
                                            checked={ticket.entregado || false} 
                                            onChange={() => toggleEntrega(ticket.userId, ticket.id)}
                                        />
                                        <span>¿Entregado?</span>
                                    </label>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default GestionTickets;
