//GET USUARIOS funcion que consulta al endpoint a traves de un fetch, conuslta al API al Endpoint
async function getUsuarios() {
    try {
        const respuestaServidor = await fetch("http://127.0.0.1:3001/usuarios")
        if (!respuestaServidor.ok) {
            throw new Error(`HTTP error! status: ${respuestaServidor.status}`);
        }
        const datosUsuarios= await respuestaServidor.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al obtener los usuarios", error);
        return null;
    }
}

//POST USUARIOS AQUI SE VA A CREAR LA FUNCION PARA GUARDAR UN NUEVO USUARIO
async function postUsuarios(usuario){
    try {
        const respuesta = await fetch("http://127.0.0.1:3001/usuarios",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(usuario)
        })
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosUsuarios= await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al guardar el usuario", error);
        return null;
    }
}

//PUT
async function putUsuarios(usuario,id){
    try {
        const respuesta = await fetch("http://127.0.0.1:3001/usuarios/"+id,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(usuario)
        })
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosUsuarios= await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
        return null;
    }
}

//DELETE
async function deleteUsuarios(id){
    try {
        const respuesta = await fetch("http://127.0.0.1:3001/usuarios/"+id,{
            method:"DELETE",
        })
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosUsuarios= await respuesta.json();
        return datosUsuarios;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
        return null;
    }
}
export default{getUsuarios,postUsuarios,putUsuarios,deleteUsuarios}


