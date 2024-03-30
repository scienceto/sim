const {Product, Warehouse, ProductInventory, sequelize, TradeRecord, Purchase} = require('../models/models');

const listProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error in listing products:', error);
    return res.status(500).json({error: 'Error in adding product'});
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
    return res.status(500).json({error: 'Error updating product'});
  }
};

const addProduct = async (req, res) => {
    try {
        const {name, category, description, sale_price} = req.body;
        const t = await sequelize.transaction();
        try {
            const newProduct = await Product.create({
                name,
                category,
                description,
                sale_price
            });
            const warehouses = await Warehouse.findAll();
            const promise = warehouses.map((warehouse) => {
                ProductInventory.create({
                    product: newProduct.id,
                    quantity: 0,
                    warehouse: warehouse.id
                });
            })
            await t.commit();
            return res.status(201).json(newProduct);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in adding product:', error);
        return res.status(500).json({error: 'Error in adding product'});
    }
};

const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const {name, category, description, disabled, sale_price} = req.body;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({error: 'Product not found.'});
        }
        await product.update({
            name,
            category,
            description,
            disabled,
            sale_price
        });
        return res.status(200).json(product);

    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({error: 'Error updating product'});
    }
};

const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }
        product.disabled = true;
        await product.save();
        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({error: 'Error deleting product'});
    }
};

module.exports = {
    addProduct,
    deleteProduct,
    updateProduct,
    listProducts,
    getProduct
};
  