import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceUsuarios from '../Services/ServiceUsuarios'
import Navar from './Navar'
import '../Styles/MostrarUsuarios.css'

function MostrarUsuarios() {
    const [usuarios, setUsuarios] = useState([])
    const [editando, setEditando] = useState(null)
    const [formEdit, setFormEdit] = useState({ Nombre: "", Correo: "", Contraseña: "" })
    const [mensaje, setMensaje] = useState("")
    const navigate = useNavigate()

    const cargarUsuarios = async () => {
        const dataUsuarios = await ServiceUsuarios.getUsuarios()
        if (dataUsuarios) {
            setUsuarios(dataUsuarios)
        }
    }

    useEffect(() => {
        const rol = localStorage.getItem("rol")
        
        if (rol !== "admin") {
            setMensaje("Acceso denegado. Esta página es solo para administradores.")
            setTimeout(() => navigate("/"), 2000)
            return
        }

        cargarUsuarios()
    }, [navigate])

    const handleEliminar = async (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            const eliminado = await ServiceUsuarios.deleteUsuarios(id)
            if (eliminado) {
                setMensaje("Usuario eliminado correctamente ✅")
                setTimeout(() => setMensaje(""), 3000)
                cargarUsuarios()
            }
        }
    }

    const handleActualizar = async () => {
        const actualizado = await ServiceUsuarios.putUsuarios(formEdit, editando.id)
        if (actualizado) {
            setMensaje("Usuario actualizado correctamente ✅")
            setTimeout(() => setMensaje(""), 3000)
            setEditando(null)
            cargarUsuarios()
        }
    }

    return (
        <div className="list-container">
            <Navar />
            <h2 className="list-titulo">Usuarios Registrados</h2>

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
                {usuarios.map((usuario) => (
                    <div className="list-card" key={usuario.id}>
                        <span className="label">Nombre completo</span>
                        <h2>{usuario.Nombre}</h2>
                        
                        <span className="label">Correo electrónico</span>
                        <p>{usuario.Correo}</p>
                        
                        <div className="card-actions">
                            <button className="btn-edit" onClick={() => {
                                setEditando(usuario)
                                setFormEdit({ Nombre: usuario.Nombre, Correo: usuario.Correo, Contraseña: usuario.Contraseña })
                            }}>Editar</button>
                            <button className="btn-delete" onClick={() => handleEliminar(usuario.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Edición */}
            {editando && (
                <div className="modal-overlay">
                    <div className="datosAdmi" style={{width: '400px'}}>
                        <h1>Editar Usuario</h1>
                        <h4>Nombre:</h4>
                        <input type="text" value={formEdit.Nombre} onChange={(e) => setFormEdit({...formEdit, Nombre: e.target.value})} />
                        <h4>Correo:</h4>
                        <input type="email" value={formEdit.Correo} onChange={(e) => setFormEdit({...formEdit, Correo: e.target.value})} />
                        <h4>Contraseña:</h4>
                        <input type="password" value={formEdit.Contraseña} onChange={(e) => setFormEdit({...formEdit, Contraseña: e.target.value})} />
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button onClick={handleActualizar}>Actualizar</button>
                            <button onClick={() => setEditando(null)} style={{backgroundColor: '#666'}}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {usuarios.length === 0 && (
                <p style={{textAlign: 'center', color: '#888', marginTop: '50px'}}>No hay usuarios registrados actualmente.</p>
            )}
        </div>
    )
}
export default MostrarUsuarios