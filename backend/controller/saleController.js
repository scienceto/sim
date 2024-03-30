const { Sale } = require('../models/models');

const addSale = async (req, res) => {
    try {
        const { timestamp, status, customer, app_user, warehouse, product } = req.body;
        const newSale = await Sale.create({
            timestamp,
            status,
            customer,
            app_user,
            warehouse,
            product
        });
        return res.status(201).json(newSale);
    } catch (error) {
        console.error('Error in adding sale:', error);
        return res.status(500).json({ error: 'Error in adding sale' });
    }
};

const listSales = async (req, res) => {
    try {
        const sales = await Sale.findAll();
        return res.status(200).json(sales);
    } catch (error) {
        console.error('Error in listing all sales:', error);
        return res.status(500).json({ error: 'Error in listing all sales' });
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
        return res.status(500).json({ error: 'Error retrieving sale' });
    }
};

module.exports = {
    addSale,
    listSales,
    getSale
};
