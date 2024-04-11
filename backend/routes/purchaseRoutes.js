const ex = require('express');
const router = ex.Router();
const purchaseController = require('../controller/purchaseController');


router.post('/', purchaseController.addPurchase);
router.get('/', purchaseController.listPurchases);
router.get('/:id', purchaseController.getPurchase);
router.post('/:id/fulfill', purchaseController.fulfillPurchase);


module.exports = router;