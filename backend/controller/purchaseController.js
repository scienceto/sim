const { sequelize, Purchase, ProductInventory, TradeRecord } = require('../models/models');

const addPurchase = async (req, res) => {
    try {
        const { supplier, product, warehouse, quantity, price } = req.body;
        const timestamp = Date.now();
        const trade_status = "PENDING";
        const t = await sequelize.transaction();
        try {
            const newTradeRecord = await TradeRecord.create({
                quantity,
                price,
                warehouse,
                product
            });
            const newPurchase = await Purchase.create({
                timestamp,
                trade_status,
                supplier,
                trade_record: newTradeRecord.id
            });
            await t.commit();
            return res.status(201).json(newPurchase);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in adding purchase:', error);
        return res.status(500).json({ error: error.message });
    }
};

const listPurchases = async (req, res) => {
    try {
        const purchases = await Purchase.findAll();
        return res.status(200).json(purchases);
    } catch (error) {
        console.error('Error in listing all purchases:', error);
        return res.status(500).json({ error: error.message });
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
        return res.status(500).json({ error: error.message });
    }
};

const fulfillPurchase = async (req, res) => {
    try {
        const { id } = req.params;
        const t = await sequelize.transaction();
        try {
            const purchase = await Purchase.findByPk(id);
            if (!purchase) {
                await t.rollback();
                return res.status(404).json({ error: 'Purchase not found.' });
            }
            const tradeRecord = await TradeRecord.findByPk(purchase.trade_record);
            const productInventory = await ProductInventory.findOne({
                where: {
                    product: tradeRecord.product,
                    warehouse: tradeRecord.warehouse,
                }
            });
            if (!productInventory) {
                await t.rollback();
                return res.status(404).json({ error: 'Product inventory not found.' });
            }
            productInventory.quantity += tradeRecord.quantity;
            await productInventory.save();
            purchase.trade_status = "COMPLETED";
            await purchase.save();
            await t.commit();
            return res.status(201).json(purchase);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error fulfilling purchase:', error);
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addPurchase,
    listPurchases,
    getPurchase,
    fulfillPurchase
};
