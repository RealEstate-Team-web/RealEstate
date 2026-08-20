const express = require('express')
const router = express.Router()
const controller = require('../controllers/propertyCategory.controller')
const {authenticate} = require('../middlewares/auth.middleware')
const {requireRole} = require('../middlewares/role.middleware')

router.post('/',authenticate,requireRole('admin'),controller.createPropertyCategory)
router.put('/:id',authenticate,requireRole('admin'),controller.updatePropertyCategory)
router.delete('/:id',authenticate,requireRole('admin'),controller.deletePropertyCategory)


router.get('/:id',controller.getPropertyCategory)
router.get('/',controller.getAllPropertyCategory)

module.exports = router