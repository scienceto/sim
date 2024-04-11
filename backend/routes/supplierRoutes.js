const ex = require('express');
const router = ex.Router();
const supplierController = require('../controller/supplierController');


router.get('/',supplierController.listSuppliers);
router.get('/:id',supplierController.getSupplier);
router.post('/',supplierController.addSupplier);
router.put('/:id', supplierController.updateSupplier);


module.exports = router;