const ex = require('express');
const router = ex.Router();
const saleController = require('../controller/saleController');


router.post('/', saleController.addSale);
router.get('/', saleController.listSales);
router.get('/:id', saleController.getSale);


module.exports = router;