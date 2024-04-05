import { Router } from "express";
import { loginuser, logoutuser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middelwares/multer.middelware.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";


const router =Router()

router.route('/register').post(
    upload.fields([
        {
            name: 'avatar', 
            maxCount: 1
        },
        {
            name:'coverImage',
            maxCount:1
        }
    ]),
    registerUser)

router.route('/login').post(loginuser)

//secured routes

router.route('/logout').post(verifyJWT, logoutuser)

export default router