const ex = require('express');
const router = ex.Router();
const productController = require('../controller/productController');


router.get('/products',productController.listProducts);
router.get('/products/:id',productController.getProduct);
router.post('/products',productController.addProduct);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);


module.exports = router;