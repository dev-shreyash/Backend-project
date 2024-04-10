import { Router } from "express";
import { verifyJWT } from "../middelwares/auth.middleware.js";
import { addComment, deleteComment, getVideoComments, updateComment } from "../controllers/comments.controller.js";



const router =Router()

router.use(verifyJWT)

router.route("/:videoId").get(getVideoComments)
router.route("/:videoId").post(addComment)
router.route("/c/:commentId:").delete(deleteComment).patch(updateComment)


export default router
