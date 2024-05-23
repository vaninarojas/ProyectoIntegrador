import { Router } from 'express';
import productsModel from '../dao/models/products.model.js';


const router = Router();

router.get('/chat', (req, res) => {
    res.render('chat', {});
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
