var express = require('express')
var router = express.Router()
// const {body} = require('express-validator');
const excelUpload = require("../middleware/ExcelUpload");
var multer = require('multer')
const bodyUpload = multer()
const excelFileController = require('../controllers/fileController.js')


// use routers
router.get('/excelFile',excelUpload.single("file"),excelFileController.excelFileUpload)


module.exports = router;