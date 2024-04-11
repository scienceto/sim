const { sequelize, Purchase, ProductInventory, TradeRecord } = require('../models/models');
const { Op } = require('sequelize');

const listPurchases = async (req, res) => {
    try {
        // Find all Purchase records with their associated TradeRecords
        const purchases = await Purchase.findAll();
        const tradeRecords = await TradeRecord.findAll({
            where: {
                purchase: {
                    [Op.ne]: null
        }}});
        const tradeRecordsMap = tradeRecords.reduce((map, record) => {
            const purchaseId = record.purchase;
            if (!map.has(purchaseId)) {
                map.set(purchaseId, []);
            }
            map.get(purchaseId).push(record);
            return map;
        }, new Map());
        const purchasesWithTradeRecords = purchases.map(purchase => ({
            ...purchase.toJSON(), // Convert to plain object
            tradeRecords: tradeRecordsMap.get(purchase.id) || []
        }));
        return res.status(200).json(purchasesWithTradeRecords);
    } catch (error) {
        console.error('Error in listing purchases with trade records:', error);
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
        console.log(typeof purchase);
        const purchaseJSON = purchase.toJSON();
        purchaseJSON["trade_records"] = await TradeRecord.findAll({
            where: {
                purchase: purchase.id
            }
        });
        res.status(200).json(purchaseJSON);
    } catch (error) {
        console.error('Error retrieving purchase:', error);
        return res.status(500).json({ error: error.message });
    }
};

const addPurchase = async (req, res) => {
    try {
        const { supplier, trade_records } = req.body;
        const timestamp = new Date();
        const trade_status = "PENDING";
        const t = await sequelize.transaction();

        try {
            // Create the Purchase record
            const newPurchase = await Purchase.create({
                timestamp,
                trade_status,
                supplier
            }, { transaction: t });

            // Create TradeRecord records for each trade_records entry
            for (const { quantity, price, product, warehouse } of trade_records) {
                await TradeRecord.create({
                    quantity,
                    price,
                    warehouse,
                    product,
                    purchase: newPurchase.id
                }, { transaction: t });
            }

            // Commit the transaction
            await t.commit();

            return res.status(201).json(newPurchase);
        } catch (error) {
            // Rollback the transaction if an error occurs
            await t.rollback();
            console.error('Error in adding purchase:', error);
            return res.status(500).json({ error: 'Failed to add purchase.' });
        }
    } catch (error) {
        console.error('Error in adding purchase:', error);
        return res.status(500).json({ error: 'Failed to add purchase.' });
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
