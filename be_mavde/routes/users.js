var express = require('express');
var router = express.Router();
var userService = require("../services/users");
var verifyToken = require('../middlewares/authMiddleware'); // de donde viene el verifyToken

/**
 * Controlador para obtener todos los usuarios de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param {Function} next - El siguiente middleware en la cadena de middleware de Express.
 */
var getAllUsersController = function (req, res, next) {
  userService.getAllUsersServices()
    .then((response) => {
      res.json(response);
    }).catch((error) => {
      next(error);
    });
};

/**
 * Controlador para crear un nuevo usuario en la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene los datos del usuario a crear.
 * @param {Object} res - El objeto de respuesta de Express.
 */
var createUserController = function (req, res, next) {
  userService.createUserServices(req.body)
    .then((response) => {
      res.status(201).json(response);
    }).catch((error) => {
      res.status(409).json(error);
    });
};

/**
 * Controlador para obtener un usuario por su email de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene el email del usuario.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param params - de esta forma con params se le indica que busque el parametro que se le indique, en este caso 'email'
 */
var getUserByEmailController = function (req, res, next) {
  userService.getUserByEmailServices(req.params.email)
    .then((response) => {
      res.status(200).json(response);
    }).catch((error) => {
      res.status(404).json(error);
    });
};

/**
 * Controlador para actualizar un usuario por su email de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene el email del usuario y los nuevos datos del usuario.
 * @param {Object} res - El objeto de respuesta de Express.
 * @param params - de esta forma con params se le indica que busque el parametro que se le indique, en este caso 'email'
 */
var updateUserByEmailController = function (req, res, next) {
  userService.updateUserByEmailServices(req.params.email, req.body)
    .then((response) => {
      res.status(200).send(response);
    }).catch((error) => {
      if(error.code === 404) {
        res.status(404).json(error);
      } else if(error.code === 400) {
        res.status(400).json(error);
      }
    });
};

/**
 * Controlador para eliminar un usuario acutailizando su status a false por su email de la base de datos.
 * 
 * @param {Object} req - El objeto de solicitud de Express que contiene el email del usuario.
 * @param {Object} res - El objeto de respuesta de Express.
 * @method res.sendStatus - Se utiliza porque solamente se va a enviar la petición, no hay contenido dentro del body de ese response.
 * @param params - de esta forma con params se le indica que busque el parametro que se le indique, en este caso 'email'
 */
var deleteUserByEmailController = function (req, res, next) {
  userService.deleteUserByEmailServices(req.params.email)
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

/**
 * Controlador para autenticar un usuario.
 * 
 * @param {Object} req - El objeto de solicitud de Express.
 * @param {Object} res - El objeto de respuesta de Express.
 */
var authenticateController = function (req, res, next) {
  userService.authenticateServices(req.body)
    .then((response) => { 
      res.json(response)
    }).catch((error) => {
      res.status(400).json(error);
    });
};

/**
 * GET users listing. *
 * 
 * se implementa verifyToken que viene de authMiddleware en medio de lo que recibo '/' para gestionar la autenticación
 * y lo que voy a ejecutar 'metodos'. Así se puede verificar que valide la sesion del usuario
 */
router.get('/', verifyToken, getAllUsersController); // fraccionar el código en problemas, separando la lógica del método por fuera
router.post('/create', createUserController);
router.get('/:email/detail', verifyToken, getUserByEmailController); // :email hace referencia al req.params.email
router.put('/:email/update', verifyToken, updateUserByEmailController);
router.delete('/:email/delete', verifyToken, deleteUserByEmailController);
router.post('/authenticate', authenticateController); // es el que está creando la verificación para el logueo

module.exports = router;
