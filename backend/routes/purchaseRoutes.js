const ex = require('express');
const router = ex.Router();
const purchaseController = require('../controller/purchaseController');


router.post('/', purchaseController.addPurchase);
router.get('/', purchaseController.listPurchases);
router.get('/:id', purchaseController.getPurchase);


module.exports = router;