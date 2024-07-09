import { Router } from 'express';
import productsModel from '../models/products.model.js';
import Message from '../models/chat.model.js';

const router = Router();

router.get('/chat', async (req, res) => {
    try {
        const messages = await Message.find().lean();
        res.render('chat', { messages });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/register', (req, res) => {
    res.render('register', {});
});

router.get('/login', (req, res) => {
    
    if (req.session.user) return res.redirect('/products');
    res.render('login', {});
});

router.get('/products', (req, res) => {

    if (!req.session.user) return res.redirect('/login');
    res.render('products', { user: req.session.user });
});


router.get('/products', async (req, res) => {
    try {
        const products = await productsModel.find().lean();
        res.render('products', { products });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.get('/products/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productsModel.findById(productId).lean();
        res.render('product-details', { product });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


export default router;
