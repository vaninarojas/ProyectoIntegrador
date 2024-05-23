import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';
import Message from '../dao/models/chat.model.js';

const router = Router();

router.get('/chat', async (req, res) => {
    try {
        const messages = await Message.find().lean();
        res.render('chat', { messages });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});
router.get('/products', async (req, res) => {
    try {
        const products = await productsModel.find().lean();
        res.render('products', { products });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});




export default router;
