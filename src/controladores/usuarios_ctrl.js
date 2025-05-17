import { conmysql } from "../bd.js";
import crypto from "crypto";

// PRESENTAR (get)
export const getUsuarios = async(req,res) => {
    try{
        const [result] = await conmysql.query('SELECT * FROM usuarios');
        res.json({
            data: result
        })
    }catch(error){
        return res.status(500).json({
            message: "Error en el Servidor"
        })
    }
} 

// INSERTAR NUEVO REGISTRO (post)
export const postUsuarios = async (req, res) => {
    try {
        // Extraer los campos del cuerpo de la solicitud
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body;

        // Hashear la contraseña con MD5
        const hashedPassword = crypto.createHash('md5').update(usr_clave).digest('hex');

        // Insertar en la base de datos
        const [result] = await conmysql.query(
            'INSERT INTO usuarios (usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo) VALUES (?,?,?,?,?,?)',
            [usr_usuario, hashedPassword, usr_nombre, usr_telefono, usr_correo, usr_activo]
        );

        res.send({
            id: result.insertId
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error en el servidor"
        });
    }
};

// ACTUALIZAR TODOS LOS CAMPOS (put)
export const putUsuarios = async(req,res) =>{
    try{
        const { id } = req.params; //parametro de la URL
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body; //cuerpo de la solicitud
        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario = ?, usr_clave = ?, usr_nombre = ?, usr_telefono = ?, usr_correo = ?, usr_activo = ? WHERE usr_id = ?',
            [ usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id ]
        )

        if(result.affectedRows<=0)return res.status(404).json({
            message: "Usuario no Encontrado"
        })

        //mostrar clientes
        const [row] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id = ?', [req.params.id]) 
        res.json(row[0])

    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}

// ACTUALIZAR SOLO ALGUNOS CAMPO (patch)
export const patchUsuarios = async(req,res) =>{
    try{
        const { id } = req.params; //parametro de la URL
        const { usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo } = req.body; //cuerpo de la solicitud
        const [result] = await conmysql.query(
            'UPDATE usuarios SET usr_usuario = IFNULL(?, usr_usuario), usr_clave = IFNULL(?, usr_clave), usr_nombre = IFNULL(?, usr_nombre), usr_telefono = IFNULL(?, usr_telefono), usr_correo = IFNULL(?, usr_correo), usr_activo = IFNULL(?, usr_activo) WHERE usr_id = ?',
            [ usr_usuario, usr_clave, usr_nombre, usr_telefono, usr_correo, usr_activo, id ]
        )

        if(result.affectedRows<=0)return res.status(404).json({
            message: "Usuario no Encontrado"
        })

        const [row] = await conmysql.query('SELECT * FROM usuarios WHERE usr_id = ?', [req.params.id]) 
        res.json(row[0])

    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}

// ELIMINAR (delete)
export const deleteUsuarios = async(req,res) =>{
    try{
        const [result] = await conmysql.query('DELETE FROM usuarios WHERE usr_id=?', [req.params.id])
        if(result.length<=0)return res.status(400).json({
            usr_id: 0,
            message: "Usuario no Encontrado"
        })
        res.sendStatus(204)
    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}