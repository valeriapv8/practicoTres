const getObjectOr404 = require('../middlewares/getObjectOr404.middleware');
const isJsonRequestValid = require('../middlewares/isJsonRequestValid.middleware');
const validationJson = require('../middlewares/validation.middleware');
const checkDuplicate = require('../middlewares/checkDuplicate.middleware');
const {validateUser} = require('../middlewares/validateUser.middleware');
const { sorteoSchema } = require('../validators/sorteoSchema');

const db = require('../models');
module.exports = app => {
	const router = require('express').Router();
	const sorteoController = require('../controllers/sorteo.controller');
	const participanteController = require('../controllers/participante.controller');

	router.get('/', sorteoController.getAllSorteos);
	router.post('/',validateUser, isJsonRequestValid, validationJson(sorteoSchema), checkDuplicate(db.SorteosModel, 'nombre'), sorteoController.createSorteo);
	router.get('/:link', sorteoController.getSorteoByLink);
	router.get('/share/:id', sorteoController.shareSorteoLink);
	router.post('/:link/deshabilitar', validateUser, sorteoController.desHabilitarSorteo);
	router.post('/:link/habilitar', validateUser, sorteoController.habilitarSorteo);
	router.post('/:link/participantes/login', isJsonRequestValid, participanteController.loginParticipante);
	

	app.use('/sorteos', router);
};