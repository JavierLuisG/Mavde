// dependencia bluebird - libreria que crearon para trabajar promesas dentro de JS sobretodo en NodeJS
var Promise = require("bluebird");

// importar la base de datos
var db = require("../config/dbmongo");
// intanciar del model products.js a product
var Product = db.Product;

/**
 * Obtiene todos los productos de la base de datos.
 * 
 * @returns {Promise<Array>} - Una promesa que se resuelve con un array de objetos que representan los productos.
 * Cada objeto contiene los siguientes campos: id, sku_code, name, product_type, quantity, price, latitude y longitude.
 * @method select - Indicar cuales campos pueden aparecer
 * @method exec - Ejecutar la consulta y obtener los resultados 
 */
var getAllProductsServices = async function () {
    return Product.find({ status: true}).select("id sku_code name product_type quantity price latitude longitude status").exec();
};

/**
 * Crea un nuevo producto en la base de datos si el SKU no existe.
 * 
 * @param {Object} productParam - El objeto que representa el registro a crear.
 * @param {string} productParam.sku_code - El código SKU del registro a crear.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el registro creado.
 * @throws {Object} - Un objeto de error con el código 409 si el SKU no existe.
 * @method save - Permite guardar en la base de datos 
 * @description - Paso a paso: 
 * 1.1. Obtener el registro por medio del 'sku_code' como parametro
 * 1.2. Obtener el registro por medio del 'name' como parametro
 * 2. Si el registro existe para 'sku_code' o 'name', lanzar un error 409 (conflict)
 * 3. Crear una instancia del esquema que se define en model/products.js
 * 4. Configurar por default que tenga un 'status: true'
 * 5. ODM, guardar la instancia en la base de datos
 * 6. Devolver la información del registro creado por medio del método 'getProductBySkuServices()'
 */
var createProductServices = async function (productParam) {
    // 1.1.
    var productBySku = await Product.findOne({ sku_code: productParam.sku_code, status: true });
    // 1.2.
    var productByName = await Product.findOne({ name: productParam.name });
    // 2.
    if (productBySku || productByName) {
        if (productBySku) {
            throw { code: 409, message: 'Conflict, product ' + productParam.sku_code + ' is already taken' };
        } else {
            throw { code: 409, message: 'Conflict, product ' + productParam.name + ' is already taken' };
        }
    }
    // 3.
    var productInstance = new Product(productParam);
    // 4.
    productInstance.status = true;
    // 5.
    await productInstance.save();
    // 6.
    return getProductBySkuServices(productParam.sku_code);
};

/**
 * Obtiene un producto por su código SKU de la base de datos.
 * 
 * @param {string} sku_codeParam - El código SKU del registro a buscar.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el objeto que representa el registro encontrado.
 * Si no se encuentra ningún registro con el código SKU especificado, la promesa se rechaza con un error 404.
 * @method select - Indicar cuales campos pueden aparecer
 * @method exec - Ejecutar la consulta y obtener los resultados
 * @description - Paso a paso:
 * 1. Obtener el registro por medio del SKU como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Devolver la información del registro
 */
var getProductBySkuServices = async function (sku_codeParam) {
    // 1.
    var productBySku = await Product.findOne({ sku_code: sku_codeParam, status: true })
    .select("id sku_code name product_type quantity price latitude longitude status").exec();
    // 2.
    if (!productBySku) {
        throw { code: 404, message: 'Product ' + sku_codeParam + ' not found' };
    }
    // 3.
    return productBySku;
};

/**
 * Actualiza un producto por su código SKU en la base de datos.
 * 
 * @param {string} sku_codeParam - El código SKU del registro a actualizar.
 * @param {Object} productParam - El objeto que contiene los nuevos datos del registro.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el objeto que representa el registro actualizado.
 * Si no se encuentra ningún registro con el código SKU especificado, la promesa se rechaza con un error 404.
 * Si ocurre un error al actualizar el registro, la promesa se rechaza con un error 400.
 * @method findByIdAndUpdate - Dos parametros: (1. id, 2. el objeto con la información a actualizar) 
 * para actualizar registro obtenido por 'productFindForUpdate'
 * @description - Paso a paso: 
 * 1. Obtener el registro por medio del SKU como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Actualizar los datos del registro
 * 4. Verificar si el registro actualizado contiene un error, lanzar un error 400 (bad request)
 * 5. Devolver la información del registro actualizado por medio del método 'getProductBySkuServices()'
 */
var updateProductBySkuServices = async function (sku_codeParam, productParam) {
    // 1.
    var productFindForUpdate = await Product.findOne({ sku_code: sku_codeParam, status: true });
    // 2.
    if (!productFindForUpdate) {
        throw { code: 404, message: 'Product ' + sku_codeParam + ' not found' };
    }
    // 3.
    var productUpdate = await Product.findByIdAndUpdate(productFindForUpdate.id,
        {
            name: productParam.name, product_type: productParam.product_type, quantity: productParam.quantity,
            price: productParam.price, latitude: productParam.latitude, longitude: productParam.longitude
        });
    // 4. si hay un error en la actualización, el valor de productUpdate será null
    if (!productUpdate) {
        throw { code: 400, message: 'Error in operation for update product: ' + productFindForUpdate.sku_code };
    }
    // 5.
    return getProductBySkuServices(productFindForUpdate.sku_code);
};

/**
 * Elimina un producto de la base de datos por su código SKU.
 * 
 * @param {string} sku_codeParam - El código SKU del registro a eliminar.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el registro eliminado.
 * @throws {Object} - Un objeto de error con el código 404 si el registro no se encuentra o 400 si hay un error en la operación.
 * @method findByIdAndDelete - Un parametro (id) para eliminar registro obtenido por 'productFindForDelete'
 * @description - Paso a paso:
 * 1. Obtener el registro por medio del SKU como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Cambiar el status a false de la base de datos
 * 4. Verificar si el registro eliminado no se llevó a cabo, lanzar un error 400 (bad request)
 */
var deleteProductBySkuServices = async function (sku_codeParam) {
    // 1.
    var productFindForDelete = await Product.findOne({ sku_code: sku_codeParam, status: true });
    // 2.
    if (!productFindForDelete) {
        throw { code: 404, message: 'Product ' + sku_codeParam + ' not found' };
    }
    // 3.
    var productDeleted = await Product.findByIdAndUpdate(productFindForDelete.id, { status: false });
    // 4. si hay un error en la actualización, el valor de productUpdate será null
    if (!productDeleted) {
        throw { code: 400, message: 'Error in operation for delete product: ' + productFindForDelete.sku_code };
    }
};

// patron factory
module.exports = {
    getAllProductsServices,
    createProductServices,
    getProductBySkuServices,
    updateProductBySkuServices,
    deleteProductBySkuServices
};