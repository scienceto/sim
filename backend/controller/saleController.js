const { Sale, sequelize, TradeRecord, Purchase} = require('../models/models');

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

module.exports = {
    addSale,
    listSales,
    getSale
};
