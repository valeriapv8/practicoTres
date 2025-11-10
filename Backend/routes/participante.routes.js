const getObjectOr404 = require('../middlewares/getObjectOr404.middleware');
const isJsonRequestValid = require('../middlewares/isJsonRequestValid.middleware');
const validationJson = require('../middlewares/validation.middleware');
const checkDuplicate = require('../middlewares/checkDuplicate.middleware');
const {validateUser} = require('../middlewares/validateUser.middleware');
const { participanteSchema } = require('../validators/participanteSchema');

const db = require('../models');
module.exports = app => {
	const router = require('express').Router();
	const participanteController = require('../controllers/participante.controller');

	// Helper para proteger rutas contra handlers no exportados
	function safeRoute(handlerName) {
	  return function (req, res, next) {
	    const fn = participanteController && participanteController[handlerName];
	    if (typeof fn !== 'function') {
	      console.error(`Participante controller handler "${handlerName}" no existe`);
	      return res.status(501).json({ error: `handler "${handlerName}" no implementado` });
	    }
	    try {
	      return fn(req, res, next);
	    } catch (err) {
	      return next(err);
	    }
	  };
	}

	// Complemento de rutas para compatibilidad frontend/backend
	router.post('/:link', safeRoute('addParticipantebySorteoLink'));
	router.post('/:link/login', safeRoute('loginParticipante'));
	router.get('/:token', safeRoute('getParticipanteByToken'));
	router.post('/:token/wishlist', safeRoute('createWishlistItem'));
	router.put('/:token', safeRoute('updateParticipante'));
	router.delete('/:token', safeRoute('deleteParticipante'));

	// Ruta para ejecutar sorteo/ asignaciones (admin)
	router.get('/sorteo/:id', safeRoute('asignarParticipantes'));

	app.use('/participantes', router);
};
