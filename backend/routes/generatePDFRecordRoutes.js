const ex = require('express');
const router = ex.Router();
const recordController = require('../controller/generatePDFController');
const balancesheetControler = require('../controller/balSheetAndTaxController');


router.get('/Balance_Sheet', balancesheetControler.generateBalanceSheetPDF);
router.get('/', recordController.generateTradeRecordsPDFs);


module.exports = router;