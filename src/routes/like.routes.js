import { Router } from "express";
import { verifyJWT } from "../middelwares/auth.middleware.js";

import { getVideoLikesCount, toggleVideoLike, toggleCommentLike,getCommentLikesCount,getLikedVideos} from "../controllers/like.controller.js";


const router =Router()

router.use(verifyJWT)

router.route("/toggle/v/:videoId").post(toggleVideoLike).get(getVideoLikesCount)
router.route("/toggle/v/:commentId").post(toggleCommentLike).get(getCommentLikesCount)
router.route("/videos").get(getLikedVideos)
export default router