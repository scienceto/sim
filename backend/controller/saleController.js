const { Sale, sequelize, TradeRecord, Purchase, ProductInventory} = require('../models/models');

const addSale = async (req, res) => {
    try {
        const { customer, product, warehouse, quantity, price } = req.body;
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
            const newSale = await Sale.create({
                timestamp,
                trade_status,
                customer,
                trade_record: newTradeRecord.id
            });
            await t.commit();
            return res.status(201).json(newSale);
        } catch (error) {
            await t.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error in adding purchase:', error);
        return res.status(500).json({ error: error.message });
    }
};

const listSales = async (req, res) => {
    try {
        const sales = await Sale.findAll();
        return res.status(200).json(sales);
    } catch (error) {
        console.error('Error in listing all sales:', error);
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
        res.status(200).json(sale);
    } catch (error) {
        console.error('Error retrieving sale:', error);
        return res.status(500).json({ error: error.message });
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
                return res.status(404).json({ error: 'Purchase not found.' });
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
    getSale
};
