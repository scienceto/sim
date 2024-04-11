const { sequelize, Sale, ProductInventory, TradeRecord } = require('../models/models');
const { Op } = require('sequelize');

const listSales = async (req, res) => {
    try {
        // Find all Purchase records with their associated TradeRecords
        const sales = await Sale.findAll();
        const tradeRecords = await TradeRecord.findAll({
            where: {
                sale: {
                    [Op.ne]: null
        }}});
        const tradeRecordsMap = tradeRecords.reduce((map, record) => {
            const saleId = record.sale;
            if (!map.has(saleId)) {
                map.set(saleId, []);
            }
            map.get(saleId).push(record);
            return map;
        }, new Map());
        const salesWithTradeRecords = sales.map(sale => ({
            ...sale.toJSON(), // Convert to plain object
            tradeRecords: tradeRecordsMap.get(sale.id) || []
        }));
        return res.status(200).json(salesWithTradeRecords);
    } catch (error) {
        console.error('Error in listing sales with trade records:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getSale = async (req, res) => {
    try {
        const { id } = req.params;
        const sale = await Sale.findByPk(id);
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found.' });
        }
        console.log(typeof sale);
        const saleJSON = sale.toJSON();
        saleJSON["trade_records"] = await TradeRecord.findAll({
            where: {
                sale: sale.id
            }
        });
        res.status(200).json(saleJSON);
    } catch (error) {
        console.error('Error retrieving sale:', error);
        return res.status(500).json({ error: error.message });
    }
};

const addSale = async (req, res) => {
    try {
        const { customer, trade_records } = req.body;
        const timestamp = new Date();
        const trade_status = "PENDING";
        const t = await sequelize.transaction();

        try {
            // Create the Purchase record
            const newSale = await Sale.create({
                timestamp,
                trade_status,
                customer
            }, { transaction: t });

            // Create TradeRecord records for each trade_records entry
            for (const { quantity, price, product, warehouse } of trade_records) {
                await TradeRecord.create({
                    quantity,
                    price,
                    warehouse,
                    product,
                    sale: newSale.id
                }, { transaction: t });
            }

            // Commit the transaction
            await t.commit();

            return res.status(201).json(newSale);
        } catch (error) {
            // Rollback the transaction if an error occurs
            await t.rollback();
            console.error('Error in adding sale:', error);
            return res.status(500).json({ error: 'Failed to add sale.' });
        }
    } catch (error) {
        console.error('Error in adding purchase:', error);
        return res.status(500).json({ error: 'Failed to add purchase.' });
    }
};

const fulfillSale = async (req, res) => {
    try {
        const { id } = req.params;
        const t = await sequelize.transaction();
        try {
            const sale = await Sale.findByPk(id);
            if (!sale) {
                await t.rollback();
                return res.status(404).json({ error: 'Sale not found.' });
            }
            const tradeRecord = await TradeRecord.findByPk(sale.trade_record);
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
            productInventory.quantity -= tradeRecord.quantity;
            await productInventory.save();
            sale.trade_status = "COMPLETED";
            await sale.save();
            await t.commit();
            return res.status(201).json(sale);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error fulfilling sale:', error);
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    addSale,
    listSales,
    getSale,
    fulfillSale
};
