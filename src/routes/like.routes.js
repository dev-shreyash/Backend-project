import { Router } from "express";
import { verifyJWT } from "../middelwares/auth.middleware.js";

import { getVideoLikesCount, toggleVideoLike} from "../controllers/like.controller.js";


const router =Router()

router.use(verifyJWT)

router.route("/toggle/v/:videoId").post(toggleVideoLike).get(getVideoLikesCount)

export default router