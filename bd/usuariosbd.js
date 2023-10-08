var conexion = require("./conexion").conexion;
var Usuario = require("../modelos/Usuarios");


async function mostrarUsuario() {
    var users = [];
    try {
        var usuarios = await conexion.get();
        //console.log(usuarios);
        usuarios.forEach((usuario) => {
            //console.log(usuario.id);
            var user = new Usuario(usuario.id, usuario.data());
            if (user.bandera == 0) {
                users.push(user.obtenerDatos);
            }
        });
    } catch (error) {
        console.log("Error al recuperar usuarios en la BD "+error);
    }
    return users;
}

async function buscarPorID (id){
    var user;
    try {
        var usuario=await conexion.doc(id).get();
        usuarioObjeto = new Usuario(usuario.id, usuario.data());
        if (usuarioObjeto.bandera==0) {
            user=usuarioObjeto.obtenerDatos;
        }
    } catch (error) {
        console.log("Error al rcuperar al usuarios "+error);
    }
    return user;
}

async function nuevoUsuario(datos){
    var user=new Usuario(null,datos);
    var error=1;
    if (user.bandera==0) {
        try {
            await conexion.doc().set(user.obtenerDatos);
            console.log("Se ha insertado el nuevo usurario a la BD");
            bandera=1;
            error=0;
        } catch (err) {
            console.log("Error la ingresar el nuevo usuario "+err);
        }
    }
    return error;
}

async function modificarUduario(datos){
    var error=1;
    var resBuscar = await buscarPorID(datos.id);
    if(resBuscar!=undefined){
        var user=new Usuario(datos.id,datos);
        if (user.bandera==0) {
            try {
                await conexion.doc(user.id).set(user.obtenerDatos);
                console.log("Registro modificado");
                error=0;
            } catch (err) {
                console.log("Error la modificar el usuario "+err);
            }
        }
    }
    return error;
}

async function borrarUsuario(id){
    var error=1;
    var user = await buscarPorID(id);
    if(user!=undefined){
        try {
            await conexion.doc(id).delete();
            console.log("Se ha borrado al usuario");
            error=0;
        } catch (err) {
            console.log("Error al borrar el usuario "+err);
        }
    }
    return error;
}

module.exports = {
    mostrarUsuario,
    buscarPorID,
    nuevoUsuario,
    modificarUduario,
    borrarUsuario
  };