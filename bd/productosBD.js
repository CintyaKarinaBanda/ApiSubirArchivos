var conexionPro = require("./conexion").conexionPro;
var Producto = require("../modelos/Productos");

async function mostrarProducto() {
    var products = [];
    try {
        var productos = await conexionPro.get();
        productos.forEach((producto) => {
            var product = new Producto(producto.id, producto.data());
            if (product.bandera == 0) {
                products.push(product.obtenerDatos);
            }
        });
    } catch (error) {
        console.log("Error al recuperar productos en la BD "+error);
    }
    return products;
}

async function nuevoProducto(datos){
    var product=new Producto(null,datos);
    var error=1;
    if (product.bandera==0) {
        try {
            await conexionPro.doc().set(product.obtenerDatos);
            console.log("Se ha insertado el nuevo producto a la BD");
            bandera=1;
            error=0;
        } catch (err) {
            console.log("Error la ingresar el nuevo producto "+err);
        }
    }
    return error;
}

async function buscarPorID (id){
    var product;
    try {
        var producto=await conexionPro.doc(id).get();
        productoObjeto = new Producto(producto.id, producto.data());
        if (productoObjeto.bandera==0) {
            product=productoObjeto.obtenerDatos;
        }
    } catch (error) {
        console.log("Error al recuperar los productos  "+error);
    }
    return product;
}

async function modificarProducto(datos){
    var error=1;
    var resBuscar = await buscarPorID(datos.id);
    if(resBuscar!=undefined){
        var product=new Producto(datos.id,datos);
        if (product.bandera==0) {
            try {
                await conexionPro.doc(product.id).set(product.obtenerDatos);
                console.log("Registro modificado");
                error=0;
            } catch (err) {
                console.log("Error la modificar el producto "+err);
            }
        }
    }
    return error;
}

async function borrarProducto(id){
    var error=1;
    var user = await buscarPorID(id);
    if(user!=undefined){
        try {
            await conexionPro.doc(id).delete();
            console.log("Se ha borrado el producto");
            error=0;
        } catch (error) {
            console.log("Error al borrar el producto "+error);
        }
    }
    return error;
}

module.exports = {
    mostrarProducto, 
    nuevoProducto,
    buscarPorID,
    modificarProducto,
    borrarProducto
  };