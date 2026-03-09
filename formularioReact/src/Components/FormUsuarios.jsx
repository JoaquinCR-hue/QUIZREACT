import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceUsuarios from '../Services/ServiceUsuarios'
import '../Styles/FormUsuarios.css'



function FormUsuarios() {


    const [Nombre, setNombre] = useState("")
    const [Contraseña, setContraseña] = useState("")
    const [Correo, setCorreo] = useState("")
    const [Mensaje, setMensaje] = useState("")
    const navigate = useNavigate()
    

    async function CrearUsuario() {
        if (Nombre === "" || Contraseña === "" || Correo === "") {
            setMensaje("Por favor, complete todos los campos");
            setTimeout(() => setMensaje(""), 3000);
            return
        }

        // ELIMINADO: Validación de correos duplicados que requería conexión al servidor antes de crear
        
        const objUsuario = {
            id: String(Math.random().toString(36).substr(2, 9)),
            Nombre: Nombre,
            Contraseña: Contraseña,
            Correo: Correo
        }
        
        const UsuarioAlmacenado = await ServiceUsuarios.postUsuarios(objUsuario)
        console.log(UsuarioAlmacenado);
        
        if (UsuarioAlmacenado) {
            setMensaje("Usuario creado exitosamente");
            setNombre("");
            setCorreo("");
            setContraseña("");
            // Update: We don't automatically login here to keep it simple, 
            // but we could if needed. The IniciarSesion update is more critical.
        } else {
            setMensaje("Error al crear usuario. Verifique su conexión.");
        }

        setTimeout(() => setMensaje(""), 3000);
    }

    async function IniciarSesion() {
        if (Correo === "" || Contraseña === "") {
            setMensaje("Por favor, ingrese correo y contraseña para iniciar sesión");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        const usuarios = await ServiceUsuarios.getUsuarios();
        
        if (!usuarios) {
            setMensaje("Error de conexión con el servidor. Por favor, intente más tarde.");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        const usuarioEncontrado = usuarios.find(
            (user) => user.Correo === Correo && user.Contraseña === Contraseña
        );

        if (usuarioEncontrado) {
            localStorage.setItem("rol", "usuario");
            localStorage.setItem("nombre", usuarioEncontrado.Nombre);
            localStorage.setItem("id", usuarioEncontrado.id);
            localStorage.setItem("correo", usuarioEncontrado.Correo);
            setMensaje(`¡Bienvenido ${usuarioEncontrado.Nombre}!`);
            setTimeout(() => navigate('/Productos'), 1500);
        } else {
            setMensaje("Credenciales incorrectas");
            setTimeout(() => setMensaje(""), 3000);
        }
    }

    return (
        <div className='datosUsuario'>
            <h1>USUARIO - INICIAR SESION O REGISTRAR</h1>


            <h4>Nombre:</h4>
            <input type="text" value={Nombre} onChange={(evento) => setNombre(evento.target.value)} />
            <h4>Correo:</h4>
            <input type="email" value={Correo} onChange={(evento) => setCorreo(evento.target.value)} />
            <h4>Contraseña</h4>
            <input type="password" value={Contraseña} onChange={(evento) => setContraseña(evento.target.value)} />

            <div className="form-btn-group">
                <button onClick={CrearUsuario}>Crear Usuario</button>
                <button onClick={IniciarSesion}>Iniciar Sesión</button>
            </div>
            {Mensaje && <h4 className="mensaje-exito">{Mensaje}</h4>}
        </div>
    )
}
export default FormUsuarios



