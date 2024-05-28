// dependencia bluebird - libreria que crearon para trabajar promesas dentro de JS sobretodo en NodeJS
var Promise = require("bluebird");
// importar libreria para poder hacer la firma
var jwt = require("jsonwebtoken"); 
// traer el secret para hacer la firma del codigo
var config = require("../middlewares/config.json"); 

// importar la base de datos
var db = require("../config/dbmongo");
// intanciar del model users.js a product
var User = db.User;

/**
 * Obtiene todos los usuarios de la base de datos.
 * 
 * @returns {Promise<Array>} - Una promesa que se resuelve con un array de objetos que representan los usuarios.
 * Cada objeto contiene los siguientes campos: id, email, firstname, lastname, phone y status.
 * @method select - Indicar cuales campos pueden aparecer
 * @method exec - Ejecutar la consulta y obtener los resultados 
 */
var getAllUsersServices = async function () {
  return User.find().select("id email firstname lastname phone status").exec();
};

/**
 * Crea un nuevo usuario en la base de datos si el email no está habilitado (status: false).
 * 
 * @param {Object} productParam - El objeto que representa el registro a crear.
 * @param {string} userParam.email - El email del registro a crear.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el registro creado.
 * @throws {Object} - Un objeto de error con el código 409 si el email no existe.
 * @method save - Permite guardar en la base de datos 
 * @description - Paso a paso: 
 * 1. Obtener el registro por medio del email y status como parametros
 * 2. Si el registro existe, lanzar un error 409 (conflict)
 * 3. Crear una instancia del esquema que se define en 'model/users.js'
 * 4. Configurar por default que tenga un 'status: true'
 * 5. ODM, guardar la instancia en la base de datos
 * 6. Devolver la información del registro creado por medio del método 'getUserByEmailServices()'
 */
var createUserServices = async function (userParam) {
  // 1.
  var userByEmail = await User.findOne({ email: userParam.email, status: true });
  // 2. 
  if (userByEmail) {
    throw { code: 409, message: "Conflict, user " + userParam.email + " is already taken" };
  }
  // 3.
  var userInstance = new User(userParam);
  // 4.
  userInstance.status = true;
  // 5.
  await userInstance.save();
  // 6.
  return getUserByEmailServices(userParam.email);
};

/**
 * Obtiene un usuario por su email de la base de datos.
 * 
 * @param {string} userEmailParam - El email del registro a buscar.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el objeto que representa el registro encontrado.
 * Si no se encuentra ningún registro con el email especificado, la promesa se rechaza con un error 404.
 * @method select - Indicar cuales campos pueden aparecer
 * @method exec - Ejecutar la consulta y obtener los resultados
 * @description - Paso a paso:
 * 1. Obtener el registro por medio del email y status como parametros
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Devolver la información del registro
 */
var getUserByEmailServices = async function (userEmailParam) {
  // 1.
  var userByEmail = await User.findOne({ email: userEmailParam, status: true })
    .select("id email firstname lastname phone status").exec();
  // 2.
  if (!userByEmail) {
    throw { code: 404, message: "User " + userEmailParam + " not found" };
  }
  // 3.
  return userByEmail;
};


/**
 * Actualiza un usuario por su email en la base de datos.
 * 
 * @param {string} userEmailParam - El email del registro a actualizar.
 * @param {Object} userParam - El objeto que contiene los nuevos datos del registro.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el objeto que representa el registro actualizado.
 * Si no se encuentra ningún registro con el email especificado, la promesa se rechaza con un error 404.
 * Si ocurre un error al actualizar el registro, la promesa se rechaza con un error 400.
 * @method findByIdAndUpdate - Dos parametros: (1. id, 2. el objeto con la información a actualizar) 
 * para actualizar registro obtenido por 'userFindForUpdate'
 * @description - Paso a paso: 
 * 1. Obtener el registro por medio del email como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Actualizar los datos del registro
 * 4. Verificar si el registro actualizado contiene un error, lanzar un error 400 (bad request)
 * 5. Devolver la información del registro actualizado por medio del método 'getUserByEmailServices()'
 */
var updateUserByEmailServices = async function (userEmailParam, userParam) {
  // 1.
  var userFindForUpdate = await User.findOne({ email: userEmailParam, status: true });
  // 2.
  if (!userFindForUpdate) {
    throw { code: 404, message: 'User ' + userEmailParam + ' not found' };
  }
  // 3.
  var userUpdate = await User.findByIdAndUpdate(userFindForUpdate.id,
    { firstname: userParam.firstname, lastname: userParam.lastname, phone: userParam.phone });
  // 4. si hay un error en la actualización, el valor de productUpdate será null
  if (!userUpdate) {
    throw { code: 400, message: 'Error in operation for update user: ' + userFindForUpdate.email };
  }
  // 5.
  return getUserByEmailServices(userFindForUpdate.email);
};

/**
 * Elimina (cambiando su estado a false) un usuario de la base de datos por su email.
 * 
 * @param {string} userEmailParam - El email del registro a eliminar.
 * @returns {Promise<Object>} - Una promesa que se resuelve con el registro eliminado.
 * @throws {Object} - Un objeto de error con el código 404 si el registro no se encuentra o 400 si hay un error en la operación.
 * @method findByIdAndDelete - Un parametro (id) para eliminar registro obtenido por 'userFindForDelete'
 * @description - Paso a paso:
 * 1. Obtener el registro por medio del email como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Cambiar el status a false de la base de datos
 * 4. Verificar si el registro actualizado no se llevó a cabo, lanzar un error 400 (bad request)
 */
var deleteUserByEmailServices = async function (userEmailParam) {
  // 1.
  var userFindForDelete = await User.findOne({ email: userEmailParam, status: true });
  // 2.
  if (!userFindForDelete) {
    throw { code: 404, message: 'User ' + userEmailParam + ' not found' }
  }
  // 3.
  var userForChangeStatus = await User.findByIdAndUpdate(userFindForDelete.id, { status: false });
  // 4.
  if (!userForChangeStatus) {
    throw { code: 400, message: 'Error in operation for delete user: ' + userFindForDelete.email };
  }
};

/**
 * Autentica un usuario en el sistema utilizando su correo electrónico y contraseña.
 * 
 * @param {Object} userParam - El objeto que contiene el correo electrónico y contraseña del registro.
 * @param {string} userParam.email - El correo electrónico del registro.
 * @param {string} userParam.password - La contraseña del registro.
 * @returns {Promise<Object>} - Una promesa que se resuelve con la información del registro autenticado y un token JWT.
 * @throws {Object} - Un objeto de error con el código 404 si el registro no se encuentra o las credenciales son incorrectas.
 * @method jwt.sing - utilizado para firmar o crear un token JWT. Toma tres parámetros:
 * 1- Payload: objeto que contiene la información que se desea incluir en el token. 
 * 2- Secret (Clave secreta): Es una cadena secreta que se utiliza para firmar el token, para verificar la autenticidad del token
 * 3- Options (Opciones): objeto que contiene diversas opciones para personalizar el token, como el tiempo de expiración 'expiresIn'
 * @description - Paso a paso:
 * 1. Obtener el registro por medio del email como parametro
 * 2. Si el registro no existe, lanzar un error 404 (not found)
 * 3. Crea un objeto con la información básica del registro encontrado.
 * 4. Genera un token JWT para el registro autenticado con cierta información y configuración.
 * 5. Devuelve la información del registro autenticado junto con el token JWT.
 */
var authenticateServices = async function (userParam) {
  // 1.
  var userForAuth = await User.findOne({ email: userParam.email, password: userParam.password, status: true });
  // 2. 
  if (!userForAuth) {
    throw { code: 404, message: 'User not found, check the credentials' };
  }
  // 3.
  var userAuth = {
    id: userForAuth.id,
    email: userForAuth.email,
    firstname: userForAuth.firstname,
    lastname: userForAuth.lastname,
    phone: userForAuth.phone,
    status: userForAuth.status,
  };
  // 4.
  userAuth.token = jwt.sign(
    {
      sub: {
        email: userAuth.email,
        firstname: userAuth.firstname,
        lastname: userAuth.lastname,
        locale: "CO",
        roles: {
          is_admin: true,
          is_user: true,
        },
      },
    },
    config.secret,
    { expiresIn: "120m" }
  );
  // 5.
  return(userAuth);
};

// como este script no es visible, para exportar un modulo dentro de JS se usa el patron factory
module.exports = {
  getAllUsersServices,
  createUserServices,
  getUserByEmailServices,
  updateUserByEmailServices,
  deleteUserByEmailServices,
  authenticateServices
};
