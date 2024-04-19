const ex = require('express');
const router = ex.Router();
const recordController = require('../controller/generatePDFController');


router.get('/', recordController.generateTradeRecordsPDFs);


module.exports = router;