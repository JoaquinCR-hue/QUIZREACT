import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ServiceAdmi from '../Services/ServiceAdmi'
import '../Styles/FormAdmi.css'




function FormAdmi() {


    const [Nombre, setNombre] = useState("")
    const [Contraseña, setContraseña] = useState("")
    const [Correo, setCorreo] = useState("")
    const [Codigo, setCodigo] = useState("")
    const [Mensaje, setMensaje] = useState("")
    const navigate = useNavigate()
    

    async function CrearAdministrador() {
        if (Nombre === "" || Contraseña === "" || Correo === "" || Codigo === "") {
            setMensaje("Por favor, complete todos los campos");
            setTimeout(() => setMensaje(""), 3000);
            return
        }

        if (Codigo !== "@Joaco2026") {
            setMensaje("Codigo Incorrecto");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        // ELIMINADO: Validación de correos duplicados que requería conexión al servidor antes de crear
        
        const objAdministrador = {
            id: String(Math.random().toString(36).substr(2, 9)),
            Nombre: Nombre,
            Contraseña: Contraseña,
            Correo: Correo
        }
        
        const AdministradorAlmacenado = await ServiceAdmi.postAdministradores(objAdministrador)
        console.log(AdministradorAlmacenado);
        
        if (AdministradorAlmacenado) {
            setMensaje("Administrador creado exitosamente");
            setNombre("");
            setCorreo("");
            setContraseña("");
            setCodigo("");
        } else {
            setMensaje("Error al crear administrador. Verifique su conexión.");
        }

        setTimeout(() => setMensaje(""), 3000);
    }

    async function IniciarSesion() {
        if (Correo === "" || Contraseña === "") {
            setMensaje("Por favor, ingrese correo y contraseña para iniciar sesión");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        const administradores = await ServiceAdmi.getAdministradores();
        
        if (!administradores) {
            setMensaje("Error de conexión con el servidor. Por favor, intente más tarde.");
            setTimeout(() => setMensaje(""), 3000);
            return;
        }

        const admiEncontrado = administradores.find(
            (admin) => admin.Correo === Correo && admin.Contraseña === Contraseña
        );

        if (admiEncontrado) {
            localStorage.setItem("rol", "admin");
            localStorage.setItem("nombre", admiEncontrado.Nombre);
            setMensaje(`¡Bienvenido Administrador ${admiEncontrado.Nombre}!`);
            setTimeout(() => navigate('/Productos'), 1500);
        } else {
            setMensaje("Credenciales incorrectas");
            setTimeout(() => setMensaje(""), 3000);
        }
    }

    return (
        <div>
            <div className='datosAdmi'> 
            <h1>ADMINISTRADOR - INICIAR SESION O REGISTRAR</h1>


            <h4>Nombre:</h4>
            <input type="text" value={Nombre} onChange={(evento) => setNombre(evento.target.value)} />
            <h4>Correo:</h4>
            <input type="email" value={Correo} onChange={(evento) => setCorreo(evento.target.value)} />
            <h4>Contraseña</h4>
            <input type="password" value={Contraseña} onChange={(evento) => setContraseña(evento.target.value)} />
            <h4>Código de Seguridad (Solo para registro):</h4>
            <input type="password" placeholder="Ingrese el código de seguridad" value={Codigo} onChange={(evento) => setCodigo(evento.target.value)} />

            <div className="form-btn-group">
                <button onClick={CrearAdministrador}>Crear Administrador</button>
                <button onClick={IniciarSesion}>Iniciar Sesión</button>
            </div>
            {Mensaje && <h4 className="mensaje-exito">{Mensaje}</h4>}
            </div>
        </div>
    )
}
export default FormAdmi