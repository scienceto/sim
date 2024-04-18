const {Product, Warehouse, ProductInventory, sequelize, TradeRecord, Purchase} = require('../models/models');

const listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error in listing products:', error);
    return res.status(500).json({error: error.message});
  }
};

const getProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({error: 'Product not found.'});
    }
    res.status(200).json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({error: error.message});
  }
};

async function addProduct(req, res) {
  const { name, category, description } = req.body;
  const t = await sequelize.transaction();
  try {
      const product = await Product.create(
        { name, category, description },
        { transaction: t }
      );

      const warehouses = await Warehouse.findAll();

      for (const warehouse of warehouses) {
        await ProductInventory.create(
          { product: product.id, quantity: 0, warehouse: warehouse.id}, 
          { transaction: t }
        );
      }
      
      await t.commit();
      res.status(201).json(product);
  } catch (error) {
    await t.rollback();
    console.error('Error in adding product:', error);
    res.status(500).json({ error: 'Failed to add product' });
  }
}

const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, category, description, disabled} = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({error: 'Product not found.'});
        }
        await product.update({
            name,
            category,
            description,
            disabled
        });
        return res.status(200).json(product);

    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({error: error.message});
    }
};

async function deleteProduct(req, res) {
    const productId = req.params.id;
  
    try {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      await product.destroy();
      return res.status(204).send();
    } catch (error) {
      console.error('Error in deleting product:', error);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }


module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    listProducts,
    getProduct
};
  