import { signup, signIn, signOut } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router(); //Router allows to create routes

// params should be in order req, res then next(could be a middle ware fn)
router.post('/sign-up', signup);

router.post('/sign-in', signIn);

router.post('/sign-out', signOut);

export default router;
