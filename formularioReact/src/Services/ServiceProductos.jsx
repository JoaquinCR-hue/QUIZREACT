async function getProductos() {
    try {
        const respuestaServidor = await fetch("http://127.0.0.1:3001/productos");
        if (!respuestaServidor.ok) {
            throw new Error(`HTTP error! status: ${respuestaServidor.status}`);
        }
        const datosProductos = await respuestaServidor.json();
        return datosProductos;
    } catch (error) {
        console.error("Error al obtener los productos", error);
        return null;
    }
}

async function postProductos(producto) {
    try {
        const respuesta = await fetch("http://127.0.0.1:3001/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosProductos = await respuesta.json();
        return datosProductos;
    } catch (error) {
        console.error("Error al guardar el producto", error);
        return null;
    }
}

async function putProductos(producto, id) {
    try {
        const respuesta = await fetch("http://127.0.0.1:3001/productos/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(producto)
        });
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosProductos = await respuesta.json();
        return datosProductos;
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        return null;
    }
}

async function deleteProductos(id) {
    try {
        const respuesta = await fetch("http://127.0.0.1:3001/productos/" + id, {
            method: "DELETE"
        });
        if (!respuesta.ok) {
            throw new Error(`HTTP error! status: ${respuesta.status}`);
        }
        const datosProductos = await respuesta.json();
        return datosProductos;
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        return null;
    }
}

export default { getProductos, postProductos, putProductos, deleteProductos };
