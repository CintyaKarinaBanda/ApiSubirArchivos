var rutas=require("express").Router();
var {mostrarUsuario, nuevoUsuario, modificarUduario, buscarPorID, borrarUsuario}=require("../bd/usuariosbd");
var subirArchivo=require("../middlewares/subirArchivo");
const fs = require('fs');

rutas.get("/",async(req, res)=>{
    var usuarios = await mostrarUsuario();
    res.render("usuarios/mostrar",{usuarios});
});

rutas.get("/nuevoUsuario", (req,res)=>{
    res.render("usuarios/nuevo");
});

rutas.post("/nuevoUsuario",subirArchivo(), async(req,res)=>{
    //console.log(req.body);
    req.body.foto=req.file.originalname;
    var error=await nuevoUsuario(req.body);
    res.redirect("/");
    //res.end();
});

rutas.get("/editar/:id",async(req,res)=>{
    var user=await buscarPorID(req.params.id);
    console.log(user);
    //res.end();
    res.render("usuarios/modificar",{user});
});

rutas.post("/editar",subirArchivo(), async(req,res)=>{
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
    res.redirect("/"); 
});

rutas.get("/borrar/:id", async (req, res) => {
    var user= await buscarPorID(req.params.id);
    //console.log(foto);
    try {
        fs.unlinkSync(`web/images/${user.foto}`);
        await borrarUsuario(req.params.id);
        res.redirect("/");
    } catch (error) {
        console.error("Error al borrar la foto o usuario:", error);
        res.redirect("/");
    }
});

module.exports=rutas;