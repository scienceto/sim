const PDF = require('pdfkit');
const fs = require('fs');
const path = require('path');
const db = require('../models/models');

async function generateTradeRecordsPDFs(req, res) {
    try {
        // Fetch all purchases
        const purchases = await db.Purchase.findAll();

        // Group purchases by month and year
        const months = {};
        purchases.forEach(purchase => {
            const timestamp = new Date(purchase.timestamp);
            const monthYear = timestamp.toLocaleString('default', { year: 'numeric', month: 'long' });

            if (!months[monthYear]) months[monthYear] = [];
            months[monthYear].push(purchase);
        });

        for (const monthYear in months) {
            // Create a new PDF document
            const doc = new PDF();
            
            // Define the file path for the PDF
            const directoryPath = path.join(__dirname, '..', 'pdfs');
            const filePath = path.join(directoryPath, `${monthYear}.pdf`);
            
            // Ensure the directory exists
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath, { recursive: true });
            }
            
            // Pipe the PDF to a write stream to save it
            const writeStream = fs.createWriteStream(filePath);
            doc.pipe(writeStream);

            // Generate PDF content
            doc.fontSize(16).text(`Trade Records for ${monthYear}`, { align: 'center' });
            doc.moveDown();

            // Fetch trade records asynchronously
            for (const purchase of months[monthYear]) {
                const tradeRecords = await db.TradeRecord.findAll({ where: { purchase: purchase.id } });
                tradeRecords.forEach(tradeRecord => {
                    // Format and add trade record data to PDF
                    doc.text(`Product: ${tradeRecord.product.name}`);
                    doc.text(`Warehouse: ${tradeRecord.warehouse.name}`);
                    doc.text(`Quantity: ${tradeRecord.quantity}`);
                    doc.text(`Price: $${tradeRecord.price}`);
                    doc.text(`Total: $${tradeRecord.quantity * tradeRecord.price}`);
                    doc.moveDown();
                });
            }

            // Finalize PDF
            doc.end();
        }

        console.log('PDFs generated successfully');
        res.status(200).json({ success: true, message: 'Trade records generated' });
    } catch (error) {
        console.error('Error generating PDFs:', error);
        res.status(500).json({ success: false, error: 'Failed to generate PDFs' });
    }
}

module.exports = {
    generateTradeRecordsPDFs
};

