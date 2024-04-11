const { Supplier } = require('../models/models');

const listSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        return res.status(200).json(suppliers);
    } catch (error) {
        console.error('Error in listing suppliers:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ error: 'Supplier not found.' });
        }
        res.status(200).json(supplier);
    } catch (error) {
        console.error('Error getting Supplier:', error);
        return res.status(500).json({ error: error.message });
    }
};

const addSupplier = async (req, res) => {
    const { name, address, contact_email, metadata } = req.body;
    try {
        const newSupplier = await Supplier.create({
            name,
            address,
            contact_email,
            metadata
        });
        res.status(201).json(newSupplier);
    } catch (error) {
        console.error('Error in adding supplier:', error);
        res.status(500).json({ error: 'Failed to add supplier' });
    }
}

const updateSupplier = async (req, res) => {
    try {
        const {id} = req.params;
        const { name, address, contact_email, metadata } = req.body;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({error: 'Supplier not found.'});
        }
        await supplier.update({
            name,
            address,
            contact_email,
            metadata
        });
        return res.status(200).json(supplier);
    } catch (error) {
        console.error('Error updating supplier:', error);
        return res.status(500).json({error: error.message});
    }
};

module.exports = {
    listSuppliers,
    getSupplier,
    addSupplier,
    updateSupplier
}