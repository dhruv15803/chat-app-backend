import express from 'express';
import { protectRoute } from '../middlewares/user.middleware.js';
import { createGroup, getMyGroups } from '../controllers/group.controller.js';
const router = express.Router();
router.post('/create', protectRoute, createGroup);
router.get('/getMyGroups', protectRoute, getMyGroups);
export default router;
