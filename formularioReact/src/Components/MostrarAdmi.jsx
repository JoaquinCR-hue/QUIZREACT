import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceAdmi from '../Services/ServiceAdmi'
import Navar from './Navar'
import '../Styles/MostrarAdmi.css'

function MostrarAdmi() {
    const [admins, setAdmins] = useState([])
    const [editando, setEditando] = useState(null)
    const [formEdit, setFormEdit] = useState({ Nombre: "", Correo: "", Contraseña: "" })
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    const cargarAdmins = async () => {
        const data = await ServiceAdmi.getAdministradores()
        if (data) {
            setAdmins(data)
        }
    }

    useEffect(() => {
        const rol = localStorage.getItem("rol")
        
        if (rol !== "admin") {
            setMensaje("Acceso denegado. Solo administradores pueden ver esta lista.")
            setTimeout(() => navigate("/"), 2000)
            return
        }

        cargarAdmins()
    }, [navigate])

    const handleEliminar = async (id) => {
        if (window.confirm("¿Deseas eliminar a este administrador?")) {
            const eliminado = await ServiceAdmi.deleteAdministradores(id)
            if (eliminado) {
                setMensaje("Administrador eliminado correctamente ✅")
                setTimeout(() => setMensaje(""), 3000)
                cargarAdmins()
            }
        }
    }

    const handleActualizar = async () => {
        const actualizado = await ServiceAdmi.putAdministradores(formEdit, editando.id)
        if (actualizado) {
            setMensaje("Datos actualizados correctamente ✅")
            setTimeout(() => setMensaje(""), 3000)
            setEditando(null)
            cargarAdmins()
        }
    }

    return (
        <div className="list-container">
            <Navar />
            <h2 className="list-titulo">Panel de Administradores</h2>

            {/* Notificación en pantalla */}
            {mensaje && (
                <div style={{
                    position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: mensaje.includes('denegado') ? '#ff4444' : '#04fd9e',
                    color: mensaje.includes('denegado') ? '#fff' : '#000',
                    padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold',
                    zIndex: 2000, boxShadow: '0 4px 15px rgba(0,0,0,0.3)', textAlign: 'center'
                }}>
                    {mensaje}
                </div>
            )}

            <div className="list-grid">
                {admins.map((admin) => (
                    <div className="list-card" key={admin.id}>
                        <span className="label">Administrador</span>
                        <h2>{admin.Nombre}</h2>
                        
                        <span className="label">Correo de Empresa</span>
                        <p>{admin.Correo}</p>
                        
                        <div className="card-actions">
                            <button className="btn-edit" onClick={() => {
                                setEditando(admin)
                                setFormEdit({ Nombre: admin.Nombre, Correo: admin.Correo, Contraseña: admin.Contraseña })
                            }}>Editar</button>
                            <button className="btn-delete" onClick={() => handleEliminar(admin.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Edición */}
            {editando && (
                <div className="modal-overlay">
                    <div className="datosAdmi" style={{border: '1px solid #fd7404', width: '400px'}}>
                        <h1 style={{color: '#fd7404'}}>Editar Admin</h1>
                        <h4>Nombre:</h4>
                        <input type="text" value={formEdit.Nombre} onChange={(e) => setFormEdit({...formEdit, Nombre: e.target.value})} />
                        <h4>Correo:</h4>
                        <input type="email" value={formEdit.Correo} onChange={(e) => setFormEdit({...formEdit, Correo: e.target.value})} />
                        <h4>Contraseña:</h4>
                        <input type="password" value={formEdit.Contraseña} onChange={(e) => setFormEdit({...formEdit, Contraseña: e.target.value})} />
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={handleActualizar} style={{border: '1px solid #fd7404'}}>Guardar Cambios</button>
                            <button onClick={() => setEditando(null)} style={{backgroundColor: '#666', border: 'none'}}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {admins.length === 0 && (
                <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>No hay administradores registrados.</p>
            )}
        </div>
    )
}

export default MostrarAdmi
