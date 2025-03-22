import multer from "multer";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "C:/Users/Soumyajit Sarkar/Desktop/HealthMate/public")
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
const upload = multer({ 
    storage, 
})

export {upload}