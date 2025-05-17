import express from 'express'
import cors from 'cors'

//subir imagenes
import path from 'path'
import { fileURLToPath } from 'url'

//importar las rutas
import clientesRoutes from './routes/clientes_routes.js'
import pedidosRoutes from './routes/pedidos_routes.js'
import detallePedidoRoutes from './routes/detalle_pedido_routes.js'
import productosRoutes from './routes/productos_routes.js'
import usuariosRoutes from './routes/usuarios_routes.js'

//autenticacion
import autenticacionRoutes from './routes/autenticacion_routes.js'

import { verificarToken } from './middleware/verificarToken.js'

//definir móulos de entrada
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//definir permisos
const corsOptions = {
    origin: '*', //se puede poner la dirección del dominio del servidor, en este caso es de cualquiera
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credential: true
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json()); //interpreta objetos json
app.use(express.urlencoded({extended: true})) //receptar formularios
app.use('/uploads', express.static(path.join(__dirname,'../uploads'))) //direccionar donde quiere guardar la info

//indicar para rutas publicas
app.use('/api', autenticacionRoutes);

//rutas protegidas
app.use('/api', verificarToken, clientesRoutes);
app.use('/api', verificarToken, pedidosRoutes);
app.use('/api', verificarToken, detallePedidoRoutes);
app.use('/api', verificarToken, productosRoutes);
app.use('/api', verificarToken, usuariosRoutes);


app.use((req,resp,next) =>{
    resp.status(400).json({
        message: 'Endponit not found'
    })
}
)

export default app;