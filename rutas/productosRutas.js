var rutasP=require("express").Router();
var subirArchivo=require("../middlewares/subirArchivo");
const fs = require('fs');
var {mostrarProducto, nuevoProducto, modificarProducto, borrarProducto, buscarPorID}=require("../bd/productosBD");

rutasP.get("/",async(req, res)=>{
    var productos = await mostrarProducto();
    res.render("productos/mostrar",{productos});
});

rutasP.get("/nuevo", (req,res)=>{
    res.render("productos/nuevo");
});

rutasP.post("/nuevo",subirArchivo(), async(req,res)=>{
    req.body.foto=req.file.originalname;
    var productos = await nuevoProducto(req.body);
    res.redirect("/productos");
});

rutasP.get("/editar/:id",async(req,res)=>{
    var product=await buscarPorID(req.params.id);
    //console.log(user);
    res.render("productos/modificar",{product});
});

rutasP.post("/editar",subirArchivo(),async(req,res)=>{
    var product= await buscarPorID(req.body.id);
    if (product.foto!=req.file.originalname) {
        try {
            fs.unlinkSync(`web/images/${product.foto}`);
        } catch (error) {
            console.error("Error al borrar la foto: ", error);
        }
    }
    req.body.foto=req.file.originalname;
    var error=await modificarProducto(req.body);
    res.redirect("/productos");
});

rutasP.get("/borrar/:id",async(req,res)=>{
    var product= await buscarPorID(req.params.id);
    try {
        fs.unlinkSync(`web/images/${product.foto}`);
        await borrarProducto(req.params.id);
        res.redirect("/productos");
    } catch (error) {
        console.error("Error al borrar la foto:", error);
        res.redirect("/productos");
    }

  

});

module.exports=rutasP;