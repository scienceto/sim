const ex = require('express');
const router = ex.Router();
const purchaseController = require('../controller/purchaseController');


router.post('/purchase', purchaseController.addPurchase);
router.get('/purchase', purchaseController.listPurchases);
router.get('/purchase/:id', purchaseController.getPurchase);


module.exports = router;