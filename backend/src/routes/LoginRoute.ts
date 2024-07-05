import { Login, Register } from "../controllers/LoginCont";
import { Router } from "express";
import singleUpload from "../middlewares/multer";

const router = Router();

router.post('/login', Login)
router.post('/register', singleUpload, Register)

export default router