import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getUserWatchHistory, loginuser, logoutuser, refreshAccesstoken, registerUser, updateAccountDetails, updateUserAvater, updateUserCoverImage } from "../controllers/user.controller.js";
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

router.route("/refresh-token").post(refreshAccesstoken)

router.route("/change-password").post(verifyJWT,changeCurrentPassword)

router.route("/current-user").post(verifyJWT ,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/avatar").patch(verifyJWT,upload.single('image'), updateUserAvater)

router.route("/cover-image").patch(verifyJWT,upload.single('coverImage'), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT,getUserChannelProfile)

router.route("/history").get(verifyJWT, getUserWatchHistory)


export default router