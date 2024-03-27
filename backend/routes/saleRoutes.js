const ex = require('express');
const router = ex.Router();
const saleController = require('../controller/saleController');


router.post('/sale', saleController.addSale);
router.get('/sale', saleController.listSales);
router.get('/sale/:id', saleController.getSale);


module.exports = router;