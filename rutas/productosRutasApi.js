var rutasP=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
const fs = require('fs');
var {mostrarProducto, nuevoProducto, modificarProducto, borrarProducto, buscarPorID}=require("../bd/productosBD");

rutasP.get("/api/mostrarProductos",async(req, res)=>{
    var productos = await mostrarProducto();
    //res.render("productos/mostrar",{productos});
    if(productos.length>0)
        res.status(200).json(productos);
    else
        res.status(400).json("No hay productos");
});

rutasP.get("/api/buscarProductoPorId/:id",async(req,res)=>{
    var user=await buscarPorID(req.params.id);
    //res.render("usuarios/modificar",{user});
    if(user==undefined)
        res.status(400).json("No se encontro el producto");
    else
        res.status(200).json(user);
});

rutasP.post("/api/nuevoProductos", subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var errorProductos = await nuevoProducto(req.body);
    //res.redirect("/productos");
    if(errorProductos==0)
        res.status(200).json("Producto Registrado");
    else
        res.status(400).json("Error el registrar producto");
});

rutasP.post("/api/editarProductos",subirArchivo(),async(req,res)=>{
    var user= await buscarPorID(req.body.id);
    if (user.foto!=req.file.originalname) {
        try {
            fs.unlinkSync(`web/images/${user.foto}`);
        } catch (error) {
            console.error("Error al borrar la foto o usuario:", error);
        }
    }
    req.body.foto=req.file.originalname;
    var errorProducto=await modificarProducto(req.body);
    //res.redirect("/productos");
    if(errorProducto==0)
        res.status(200).json("Producto Modificado");
    else
        res.status(400).json("Error el modificar producto");
});

rutasP.get("/api/borrarProductos/:id",async(req,res)=>{
    var user= await buscarPorID(req.params.id);
    try {
        fs.unlinkSync(`web/images/${user.foto}`);
    } catch (error) {
        console.error("Error al borrar la foto o usuario:", error);
    }
    var errorProducto= await borrarProducto(req.params.id);
    //res.redirect("/productos");
    if(errorProducto==0)
        res.status(200).json("Producto Borrado");
    else
        res.status(400).json("Error el borrar producto");
});

module.exports=rutasP;