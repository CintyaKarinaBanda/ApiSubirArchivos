var admin=require("firebase-admin");
var keys=require("../keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys),
    appName: 'miejemploBD'
});

var micuenta=admin.firestore();
var conexion=micuenta.collection("miejemploBD");
var conexionPro=micuenta.collection("productos");

module.exports={
    conexion,
    conexionPro
};