async function getAdministradores() {
    try {
        const respuestaServidor = await fetch("http://127.0.0.1:3001/administradores")
        if (!respuestaServidor.ok) {
            throw new Error(`HTTP error! status: ${respuestaServidor.status}`);
        }
        const datosAdministradores= await respuestaServidor.json();
        return datosAdministradores;
    } catch (error) {
        console.error("Error al obtener los administradores", error);
        return null;
    }
}

//POST ADMINISTRADORES AQUI SE VA A CREAR LA FUNCION PARA GUARDAR UN NUEVO ADMINISTRADOR
async function postAdministradores(administrador){
       try {
        const respuesta = await fetch("http://127.0.0.1:3001/administradores",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(administrador)
        })
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosAdministradores= await respuesta.json();
        return datosAdministradores;
    } catch (error) {
        console.error("Error al guardar el administrador", error);
        return null;
    }
}

//PUT
async function putAdministradores(administrador,id){
       try {
        const respuesta = await fetch("http://127.0.0.1:3001/administradores/"+id,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(administrador)
        })
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosAdministradores= await respuesta.json();
        return datosAdministradores;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
        return null;
    }
}

//DELETE
async function deleteAdministradores(id){
       try {
        const respuesta = await fetch("http://127.0.0.1:3001/administradores/"+id,{
            method:"DELETE",
        })
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosAdministradores= await respuesta.json();
        return datosAdministradores;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
        return null;
    }
}
export default{getAdministradores,postAdministradores,putAdministradores,deleteAdministradores}


