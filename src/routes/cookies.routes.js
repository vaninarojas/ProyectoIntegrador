import { Router } from 'express';
import config from '../config.js';

const router = Router()


router.get('/getcookies', async (req, res) => {
    try {
       
        const data = JSON.parse(req.signedCookies['productcookie']);
        
        res.status(200).send({ origin: config.SERVER, payload: data });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/setcookie', async (req, res) => {
    try {
       
        const cookieData = { user: 'vrojas', email: 'vani_93@hotmail.com' };
        res.cookie('productcookie', JSON.stringify(cookieData), { maxAge: 30000, signed: true });
        
        res.status(200).send({ origin: config.SERVER, payload: 'Cookie generada' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/deletecookie', async (req, res) => {
    try {
        res.clearCookie('productcookie');
        res.status(200).send({ origin: config.SERVER, payload: 'Cookie eliminada' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;
