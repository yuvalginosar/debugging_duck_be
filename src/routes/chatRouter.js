import express from "express"
import multer from "multer";
import chatController from '../controllers/chatController.js'

const router = express.Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './audio_files/') 
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '.wav')
    }
  });
  
const upload = multer({ storage: storage });

router
    .route("/")
    .post(upload.single('audio'), chatController.chatResponse)




export default router;