import { Router } from 'express';
import {getSubscribedChannels,getUserChannelSubscribers,toggleSubscription,} from "../controllers/subscription.controller.js"

import { verifyJWT } from "../middelwares/auth.middleware.js";


const router = Router()
router.use(verifyJWT)

router.route("/c/:channelId").post(toggleSubscription)
router.route("/channels").get(getSubscribedChannels)
router.route("/user").get(getUserChannelSubscribers)

export default router