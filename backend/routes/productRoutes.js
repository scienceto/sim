const ex = require('express');
const router = ex.Router();
const productController = require('../controller/productController');


router.post('/Addproducts',productController.addProduct);
router.put('/Updateproducts/:id', productController.updateProduct);
router.delete('/Removeproducts/:id', productController.deleteProduct);


module.exports = router;