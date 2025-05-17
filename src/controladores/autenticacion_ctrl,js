import { conmysql } from "../bd.js";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { JWT_CLAVE } from "../config.js";

export const login = async (req, res) => {
  const { usr_usuario, usr_clave } = req.body;
  if (!usr_usuario || !usr_clave) {
    return res.status(400).json({ message: 'Faltan credenciales' });
  }
  try {
    const claveMd5 = md5(usr_clave);
    const [rows] = await conmysql.query(
      'SELECT * FROM usuarios WHERE usr_usuario = ? AND usr_clave = ? AND usr_activo = 1',
      [usr_usuario, claveMd5]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }
    const usuario = rows[0];
    const token = jwt.sign(
      { id: usuario.usr_id, usuario: usuario.usr_usuario },
      JWT_CLAVE,
      { expiresIn: '8h' }
    );
    res.json({
      message: 'Autenticación correcta',
      token,
      usuario: {
        id: usuario.usr_id,
        usuario: usuario.usr_usuario,
        nombre: usuario.usr_nombre,
        correo: usuario.usr_correo,
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};