var rutas=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
const fs = require('fs');
var {mostrarUsuario, nuevoUsuario, modificarUduario, buscarPorID, borrarUsuario}=require("../bd/usuariosbd");

rutas.get("/api/motrarUsuarios",async(req, res)=>{
    var usuarios = await mostrarUsuario();
    //res.render("usuarios/mostrar",{usuarios});
    if(usuarios.length>0)
        res.status(200).json(usuarios);
    else
        res.status(400).json("No hay usuarios");
});

rutas.post("/api/nuevoUsuario", subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    //res.redirect("/");
    if(error==0)
        res.status(200).json("Usuario Registrado")
    else
        res.status(400).json("Datos incorrectos");
});

rutas.get("/api/buscarUsuarioPorId/:id",async(req,res)=>{
    var user=await buscarPorID(req.params.id);
    //res.render("usuarios/modificar",{user});
    if(user==undefined)
        res.status(400).json("No se encontro el usuario");
    else
        res.status(200).json(user);
});

rutas.post("/api/editarUsuario",subirArchivo(),async(req,res)=>{
    var user= await buscarPorID(req.body.id);
    if (user.foto!=req.file.originalname) {
        try {
            fs.unlinkSync(`web/images/${user.foto}`);
        } catch (error) {
            console.error("Error al borrar la foto o usuario:", error);
        }
    }
    req.body.foto=req.file.originalname;
    var error=await modificarUduario(req.body);
    if(error==0)
        res.status(200).json("El usuario fue modificado");
    else 
        res.status(400).json("Error al actualizar el usuario");

});

rutas.get("/api/borrarUsuario/:id",async(req,res)=>{
    var user= await buscarPorID(req.params.id);
    try {
        fs.unlinkSync(`web/images/${user.foto}`);
    } catch (error) {
        console.error("Error al borrar la foto o usuario:", error);
    }
    var error = await borrarUsuario(req.params.id);
    if(error==0)
        res.status(200).json("El usuario fue borrado");
    else 
        res.status(400).json("Error al borrar el usuario");
});

module.exports=rutas;