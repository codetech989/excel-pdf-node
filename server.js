const express = require('express')
var cors = require('cors')
const XLSX = require('xlsx')
const XlsxPopulate = require('xlsx-populate')
var path = require('path')
var multer = require('multer')
const http = require('http')
const fs = require('fs');

const app = express()

var corOptions = {
    origin: "https://localhost:8081"
}

// middelware

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// testing api
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log("my_req_is",req)
        cb(null, __dirname + "/uploads/");
    },
    filename: function (req, file, cb) {
    //   var datetimestamp = Date.now();
      cb(null, `ND-Pak-${file.originalname}`);
    }
});

var upload = multer({ //multer settings
  storage: storage
});
  
function validate(req, res, next) {
  if (!req.file || !req.file.mimetype.includes("excel") ){
    return res.send({
      errors: {
        message: 'file cant be empty'
      }
    });
  }
  next();
}

async function xlsxFile(file) {

  let downloadedFile =  file.originalname;
  const workbook = await XlsxPopulate.fromFileAsync(__dirname + `/uploads/ND-Pak-${downloadedFile}`);
  const sheet1 = workbook.sheet(0);
  const cellF11 = sheet1.cell("F11").value();
  const cellF12 = sheet1.cell("F12").value();
  const cellF13 = sheet1.cell("F13").value();
  const cellF14 = sheet1.cell("F14").value();
  const cellF15 = sheet1.cell("F15").value();
  const cellF16 = sheet1.cell("F16").value();
  
  console.log("========xlData=====",cellF11,cellF12,cellF13,cellF14,cellF15,cellF16);
  
  const wb = await XlsxPopulate.fromFileAsync(__dirname + '/excelFiles/GSD.xlsx');
  const sheet = wb.sheet(0);
  sheet.cell("Q15").value(cellF11);
  sheet.cell("Q16").value(cellF12);
  sheet.cell("Q17").value(cellF13);
  sheet.cell("Q18").value(cellF14);
  sheet.cell("Q19").value(cellF15);
  sheet.cell("Q20").value(cellF16);
  await wb.toFileAsync("newGsdExcel.xlsx");
}

  app.post('/api/upload/excelFile',upload.single('file')  ,function (req, res) {
    // console.log("my_file_is",req.file.mimetype);
    console.log("file_originalname======",req.file.originalname);
    // console.log("ammmaaaad",req.body.user);
    // console.log("path",path.dirname(__dirname + "/uploads/"));
    xlsxFile(req.file);

    return res.json({
        message: "File submitted Successfully",
        url: "http://178.128.165.110:8080/ND-Pak-Node/newGsdExcel.xlsx"
      });

    // const fileLocation = req.file.path;
    // console.log(fileLocation); // logs uploads/file-1541675389394.xls
    // var workbook = XLSX.readFile(fileLocation);
    // var sheet_name_list = workbook.SheetNames;
    // return res.json({
    //   json: XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]])
    // });
  });
  



// app.get('/',(req,res) => {
//     res.json({meesage:"hello from codex technologies"})
// })




// routers
const router = require('./routes/fileRouter.js')
app.use('/api/upload2', router)


// Port
const PORT = process.env.PORT || 8080

// Server
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})