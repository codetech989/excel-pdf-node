const express = require('express')
var cors = require('cors')
const XLSX = require('xlsx')
const XlsxPopulate = require('xlsx-populate')
var path = require('path')
var multer = require('multer')

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
      cb(null, `${Date.now()}-ND-Pak-${file.originalname}`);
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

async function xlsxFile() {
    const wb = await XlsxPopulate.fromFileAsync(__dirname + '/excelFiles/GSD.xlsx');
    const sheet = wb.sheet(0);
    sheet.cell("Q20").value(11.5);
    await wb.toFileAsync("newGsdExcel.xlsx");
}

  app.post('/api/upload/excelFile',upload.single('file')  ,function (req, res) {
    // console.log("my_file_is",req.file.mimetype);
    console.log("file_originalname",req.file.originalname);
    // console.log("ammmaaaad",req.body.user);
    // console.log("path",path.dirname(__dirname + "/uploads/"));
    xlsxFile();
    return res.json({
        message: "File submitted Successfully",
        url: "http://localhost/ND-Pak-Node/newGsdExcel.xlsx"
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