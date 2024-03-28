const ex = require('express');
const router = ex.Router();
const productController = require('../controller/productController');


router.get('/',productController.listProducts);
router.get('/:id',productController.getProduct);
router.post('/',productController.addProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);


module.exports = router;