import { conmysql } from "../bd.js";

// PRESENTAR (get)
export const getProductos = async(req,res) => {
    try{
        const [result] = await conmysql.query('SELECT * FROM productos');
        res.json({
            data: result
        })
    }catch(error){
        return res.status(500).json({
            message: "Error en el Servidor"
        })
    }
} 

//post
export const postProdu = async (req, res) => {
    try{
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo
        } = req.body;
        const prod_imagen = req.file ? `/uploads/${req.file.filename}`:null;
        console.log("Archivo Imagen:", req.file);

        const [fila] = await conmysql.query('SELECT *FROM productos WHERE prod_codigo=?', [prod_codigo])
        if (fila.length > 0)return res.status(404).json({
            id:0,
            message: "Producto con codigo: " + prod_codigo + ' ya está registrado' 
        })

        const[rows] = await conmysql.query('INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES  (?,?,?,?,?,?)',
            [ prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen ]
        )

        res.send({
            id:rows.insertId,
            message: "Producto Ingresado con Éxito"
        }
        )

    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }

}

export const putProdu = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo
        } = req.body;
        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Archivo Imagen:", req.file);

        // Verificar existencia del producto
        const [existente] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
        if (existente.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

        // Actualizar producto
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen || existente[0].prod_imagen, id]
        );

        res.json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};

export const patchProdu = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            prod_codigo,
            prod_nombre,
            prod_stock,
            prod_precio,
            prod_activo
        } = req.body;
        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Archivo Imagen:", req.file);

        // Verificar existencia del producto
        const [existente] = await conmysql.query('SELECT * FROM productos WHERE prod_id = ?', [id]);
        if (existente.length === 0) return res.status(404).json({ message: "Producto no encontrado" });

        // Actualizar producto parcialmente
        const [result] = await conmysql.query(
            `UPDATE productos SET 
                prod_codigo = IFNULL(?, prod_codigo),
                prod_nombre = IFNULL(?, prod_nombre),
                prod_stock = IFNULL(?, prod_stock),
                prod_precio = IFNULL(?, prod_precio),
                prod_activo = IFNULL(?, prod_activo),
                prod_imagen = IFNULL(?, prod_imagen)
             WHERE prod_id = ?`,
            [
                prod_codigo || null,
                prod_nombre || null,
                prod_stock || null,
                prod_precio || null,
                prod_activo || null,
                prod_imagen || existente[0].prod_imagen,
                id
            ]
        );

        res.json({ message: "Producto modificado con éxito" });
    } catch (error) {
        return res.status(500).json({ message: "Error en el servidor" });
    }
};


// INSERTAR NUEVO REGISTRO (post)
export const postProductos = async(req,res) => {
    try{
        //extraer los campos del cuerpo de la solicitud
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body;
        const [result] = await conmysql.query(
            'INSERT INTO productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) VALUES  (?,?,?,?,?,?)',
            [ prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen ]
        )

        res.send({
            id: result.insertId
        })
    }catch (error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}

// ACTUALIZAR TODOS LOS CAMPOS (put)
export const putProductos = async(req,res) =>{
    try{
        const { id } = req.params; //parametro de la URL
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body; //cuerpo de la solicitud
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo = ?, prod_nombre = ?, prod_stock = ?, prod_precio = ?, prod_activo = ?, prod_imagen = ? WHERE prod_id = ?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        )

        if(result.affectedRows<=0)return res.status(404).json({
            message: "Producto no Encontrado"
        })

        //mostrar clientes
        const [row] = await conmysql.query('SELECT * FROM pedidos_detalle WHERE prod_id = ?', [req.params.id]) 
        res.json(row[0])

    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}

// ACTUALIZAR SOLO ALGUNOS CAMPO (patch)
export const patchProductos = async(req,res) =>{
    try{
        const { id } = req.params; //parametro de la URL
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen } = req.body; //cuerpo de la solicitud
        const [result] = await conmysql.query(
            'UPDATE productos SET prod_codigo = IFNULL(?, prod_codigo), prod_nombre = IFNULL(?, prod_nombre), prod_stock = IFNULL(?, prod_stock), prod_precio = IFNULL(?, prod_precio), prod_activo = IFNULL(?, prod_activo), prod_imagen = IFNULL(?, prod_imagen) WHERE prod_id = ?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id]
        )

        if(result.affectedRows<=0)return res.status(404).json({
            message: "Producto no Encontrado"
        })

        const [row] = await conmysql.query('SELECT * FROM pedidos_detalle WHERE prod_id = ?', [req.params.id]) 
        res.json(row[0])

    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}

// ELIMINAR (delete)
export const deleteProductos = async(req,res) =>{
    try{
        const [result] = await conmysql.query('DELETE FROM productos WHERE prod_id=?', [req.params.id])
        if(result.length<=0)return res.status(400).json({
            prod_id: 0,
            message: "Producto no Encontrado"
        })
        res.sendStatus(204)
    }catch(error){
        return res.status(500).json({
            message: "Error en el servidor"
        })
    }
}
