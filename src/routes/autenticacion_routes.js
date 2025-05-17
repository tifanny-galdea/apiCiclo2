
import { Router } from "express";
import { login } from "../controladores/autenticacion_ctrl.js";

const router = Router();

router.post('/login', login);

export default router;
