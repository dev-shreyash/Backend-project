import { Router } from "express";
import { upload } from "../middelwares/multer.middelware.js";
import { verifyJWT } from "../middelwares/auth.middleware.js";
import { getAllVideos, publishAVideo } from "../controllers/videos.controller.js";

const router =Router()

router.use(verifyJWT)
//video

router.route("/publish-video").post(upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    )

router.route("/").get(getAllVideos)
export default router