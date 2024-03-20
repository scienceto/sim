const { Product } = require('../models/models');

const addProduct = async (req, res) => {
    try {
      const { name, category, description, purchasePrice, salePrice } = req.body;
      const newProduct = await Product.create({
        name,
        category,
        description,
        purchasePrice,
        salePrice
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Error in adding product:', error);
      res.status(500).json({ error: 'Error in adding product' });
    }
  };

  const updateProduct = async(req, res)=>{
    try {
        const { id }= req.params;
        const{ name, category, description, purchasePrice, salePrice }= req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found.' });
          }
          await product.update({
            name,
            category,
            description,
            purchasePrice,
            salePrice
          });
          res.status(200).json(product);

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product' });
    }
  };

  const deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await product.destroy();
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Error deleting product' });
    }
  };

  module.exports ={
    addProduct,
    deleteProduct,
    updateProduct
  };
  