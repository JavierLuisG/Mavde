var express = require("express");
var router = express.Router();
var productsServices = require("../services/products");
const verifyToken = require("../middlewares/authMiddleware");

/**
 * Controlador para obtener todos los productos de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - El siguiente middleware en la cadena de middleware de Express.
 */
var getAllProductsController = function (req, res, next) {
  productsServices.getAllProductsServices()
    .then((response) => {
      res.json(response);
    }).catch((error) => {
      next(error);
    });
};

/**
 * Controlador para crear un nuevo producto en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene los datos del producto a crear.
 * @param {Object} res - El objeto de respuesta de Express.
 */
var createProductController = function (req, res, next) {
  productsServices.createProductServices(req.body)
    .then((response) => {
      res.status(201).json(response);
    }).catch((error) => {
      res.status(409).json(error);
    });
};

/**
 * Controlador para obtener un producto por su código SKU de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene el código SKU del producto.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param params - de esta forma con params se le indica que busque el parametro que se le indique, en este caso 'sku_code'
 */
var getProductBySkuController = function (req, res, next) {
  productsServices.getProductBySkuServices(req.params.sku_code)
    .then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(404).json(error);
    });
};

/**
 * Controlador para actualizar un producto por su código SKU de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene el código SKU del producto y los nuevos datos del producto.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param params - de esta forma con params se le indica que busque el parametro que se le indique, en este caso 'sku_code'
 */
var updateProductBySkuController = function (req, res, next) {
  productsServices.updateProductBySkuServices(req.params.sku_code, req.body)
    .then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      if (error.code === 404) {
        res.status(404).json(error);
      }
      else if (error.code === 400) {
        res.status(400).json(error);
      }
    });
};

/**
 * Controlador para eliminar un producto por su código SKU de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene el código SKU del producto.
 * @param {Object} res - El objeto de respuesta de Express.
 * @method res.sendStatus - Se utiliza porque solamente se va a enviar la petición, no hay contenido dentro del body de ese response.
 * @param params - de esta forma con params se le indica que busque el parametro que se le indique, en este caso 'sku_code'
 */
// res.sendStatus porque 
var deleteProductBySkuController = function (req, res, next) {
  productsServices.deleteProductBySkuServices(req.params.sku_code)
    .then(() => {
      res.sendStatus(204);
    }).catch((error) => {
      if (error.code === 404) {
        res.status(404).json(error);
      } else if (error.code === 400) {
        res.status(400).json(error);
      }
    });
};

/* GET home page. */
router.get("/", getAllProductsController);
router.post("/create", verifyToken, createProductController);
router.get("/:sku_code/detail", getProductBySkuController);
router.put("/:sku_code/update", verifyToken, updateProductBySkuController);
router.delete("/:sku_code/delete", verifyToken, deleteProductBySkuController);

module.exports = router;
