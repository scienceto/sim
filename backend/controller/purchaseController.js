const { Purchase, ProductInventory } = require('../models/models');

const addPurchase = async (req, res) => {
    try {
        const { timestamp, status, supplier, app_user, warehouse, product } = req.body;
        const newPurchase = await Purchase.create({
            timestamp,
            status,
            supplier,
            app_user,
            warehouse,
            product
        });
        return res.status(201).json(newPurchase);
    } catch (error) {
        console.error('Error in adding purchase:', error);
        return res.status(500).json({ error: 'Error in adding purchase' });
    }
};

const listPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll();
        return res.status(200).json(purchases);
    } catch (error) {
        console.error('Error in listing all purchases:', error);
        return res.status(500).json({ error: 'Error in listing all purchases' });
    }
};

const getPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const purchase = await Purchase.findByPk(id);
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found.' });
        }
        res.status(200).json(purchase);
    } catch (error) {
        console.error('Error retrieving purchase:', error);
        return res.status(500).json({ error: 'Error retrieving purchase' });
    }
};

const fulfillPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const purchase = await Purchase.findByPk(id);
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found.' });
        }
        const productInventory = await ProductInventory.findOne({
            where: {
                product: purchase.product,
                warehouse: purchase.warehouse,
            }
        })
        purchase.status = "COMPLETED";
        const updatedPurchase = await purchase.save();
        res.status(200).json(updatedPurchase);
    } catch (error) {
        console.error('Error retrieving purchase:', error);
        return res.status(500).json({ error: 'Error retrieving purchase' });
    }
};

module.exports = {
    addPurchase,
    listPurchases,
    getPurchase
};
