import jwt from "jsonwebtoken";
import { JWT_CLAVE } from "../config.js";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // El token debe venir en el encabezado Authorization: Bearer <token>
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // Separa 'Bearer' del token

  if (!token) {
    return res.status(401).json({ message: 'Token no válido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_CLAVE);
    req.usuario = decoded; // Puedes acceder a esto en la siguiente función
    next(); // Continúa con la siguiente función en la ruta
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};