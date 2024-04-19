const PDF = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../models/models');
const { Op } = require('sequelize');

async function generateBalanceSheetPDF(req, res) {
    try {
        // Calculate total cost and taxes for purchases
        const { purchaseTotalCost, purchaseTotalTaxes } = await calculateTotalCostAndTaxesPurchases('purchase');
        
        // Calculate total cost and taxes for sales
        const { saleTotalRevenue, saleTotalTaxes } = await calculateTotalCostAndTaxesSales('sale');

        // Group trade records for purchases and sales by warehouse
        const purchaseTradeRecordsByWarehouse = await groupTradeRecordsByWarehouse('purchase');
        const saleTradeRecordsByWarehouse = await groupTradeRecordsByWarehouse('sale');

        // Create a new PDF document for balance sheet
        const doc = new PDF();
        
        // Define the file path for the balance sheet PDF
        const filePath = path.join(__dirname, '..', 'pdfs', 'balance_sheet.pdf');
        
        // Pipe the PDF to a write stream to save it
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // Generate PDF content for balance sheet
        doc.fontSize(16).text('Balance Sheet', { align: 'center' });
        doc.moveDown();

        // Include total cost and taxes for purchases
        doc.text('Purchases:');
        doc.text(`Total Cost: $${purchaseTotalCost}`);
        doc.text(`Total Taxes (8%): $${purchaseTotalTaxes}`);
        doc.moveDown();

        // Include information for each warehouse for purchases
        for (const warehouseId in purchaseTradeRecordsByWarehouse) {
            const tradeRecords = purchaseTradeRecordsByWarehouse[warehouseId];
            doc.text(`Warehouse ID: ${warehouseId}`);
            doc.moveDown();
            tradeRecords.forEach(tradeRecord => {
                doc.text(`Product: ${tradeRecord.Product.name}`);
                doc.text(`Quantity: ${tradeRecord.quantity}`);
                doc.text(`Price: $${tradeRecord.price}`);
                doc.text(`Total: $${tradeRecord.quantity * tradeRecord.price}`);
                doc.moveDown();
            });
            doc.moveDown();
        }

        // Include total revenue and taxes for sales
        doc.text('Sales:');
        doc.text(`Total Revenue: $${saleTotalRevenue}`);
        doc.text(`Total Taxes (8%): $${saleTotalTaxes}`);
        doc.moveDown();

        // Include information for each warehouse for sales
        for (const warehouseId in saleTradeRecordsByWarehouse) {
            const tradeRecords = saleTradeRecordsByWarehouse[warehouseId];
            doc.text(`Warehouse ID: ${warehouseId}`);
            doc.moveDown();
            tradeRecords.forEach(tradeRecord => {
                doc.text(`Product: ${tradeRecord.Product.name}`);
                doc.text(`Quantity: ${tradeRecord.quantity}`);
                doc.text(`Price: $${tradeRecord.price}`);
                doc.text(`Total: $${tradeRecord.quantity * tradeRecord.price}`);
                doc.moveDown();
            });
            doc.moveDown();
        }

        // Finalize PDF
        doc.end();

        console.log('Balance sheet PDF generated successfully');
        res.status(200).json({ success: true, message: 'Balance sheet generated' });
    } catch (error) {
        console.error('Error generating balance sheet PDF:', error);
        res.status(500).json({ success: false, error: 'Failed to generate balance sheet PDF' });
    }
}

// Function to calculate total cost and taxes for purchases or sales
async function calculateTotalCostAndTaxesSales() {
    try {
        const tradeRecords = await db.TradeRecord.findAll({ where: { sale: { [Op.ne]: null } } });

        let totalCost = 0;
        let totalTaxes = 0;
        tradeRecords.forEach(tradeRecord => {
            const amount = tradeRecord.quantity * tradeRecord.price;
            totalCost += amount;
            totalTaxes += amount * 0.08; // 8% tax
        });

        return { totalCost, totalTaxes };
    } catch (error) {
        throw error;
    }
}

async function calculateTotalCostAndTaxesPurchases() {
    try {
        const tradeRecords = await db.TradeRecord.findAll({ where: { purchase: { [Op.ne]: null } } });

        let totalCost = 0;
        let totalTaxes = 0;
        tradeRecords.forEach(tradeRecord => {
            const amount = tradeRecord.quantity * tradeRecord.price;
            totalCost += amount;
            totalTaxes += amount * 0.08; // 8% tax
        });

        return { totalCost, totalTaxes };
    } catch (error) {
        throw error;
    }

}

async function groupTradeRecordsByWarehouse(type) {
    try {
        const tradeRecords = await db.TradeRecord.findAll({
            where: { sale: type === 'sale' ? { [Op.ne]: null } : null }, // Corrected key to saleId
            include: [{ model: db.Product }, { model: db.Warehouse }]
        });

        const tradeRecordsByWarehouse = {};
        tradeRecords.forEach(tradeRecord => {
            const warehouseId = tradeRecord.Warehouse.id;
            if (!tradeRecordsByWarehouse[warehouseId]) {
                tradeRecordsByWarehouse[warehouseId] = [];
            }
            tradeRecordsByWarehouse[warehouseId].push(tradeRecord);
        });

        return tradeRecordsByWarehouse;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    generateBalanceSheetPDF
};
