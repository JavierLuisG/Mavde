// para verificar se utiliza la libreria jsonwebtoken (la info a través del header sea correcta)
var jwt = require('jsonwebtoken');
var config = require('./config.json');

function verifyToken(req, res, next) {
    try {
        var bearerHeader = req.header('Authorization'); // verificar en el header que venga el authorization
        var parts = bearerHeader.split(' ');
        if (parts) {
            if (parts && parts.length === 2) {
                var token = parts[1];
                // token -> viajó y sacó el authorization 
                // config.secret -> verifica si pasó o no
                // si codifico correctamente (toma los 3 elementos del JWT (header, payloat, verify signature) y verifica que estén correctamente)
                jwt.verify(token, config.secret, 
                    function (err, decoded) {
                    if (decoded) {
                        // next() es especifico de express
                        next(); // continuar el flujo de ejecucion segun lo acordado
                    } else {
                        return res.status(401).json({error: 'Invalid Token'});
                    }
                });
            }
        }
    } catch (err) {
        return res.status(401).json({
            error: 'Invalid Token'
        });
    }
};

module.exports = verifyToken; // se exporta el metodo para poder utilizarlo en los routes(capa de controller)