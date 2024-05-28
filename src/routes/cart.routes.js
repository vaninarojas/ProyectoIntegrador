import { Router } from 'express';
import mongoose from 'mongoose';
import Cart from '../dao/models/cart.model.js';
import productsModel from '../dao/models/products.model.js';

const router = Router();


router.get('/', async (req, res) => {
    try {
        const cart = await Cart.findOne().populate('products.product').lean();
        res.status(200).render('carts', { products: cart ? cart.products : [] });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).send({ error: 'Invalid productId' });
        }

        const product = await productsModel.findById(productId);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        let cart = await Cart.findOne();

        if (!cart) {
            cart = new Cart({ products: [{ product: product._id, quantity }] });
        } else {
            const productIndex = cart.products.findIndex(p => p.product.equals(product._id));
            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({ product: product._id, quantity });
            }
        }

        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('products.product').lean();
        res.status(200).send({ products: populatedCart.products });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: 'Invalid productId' });
        }

        let cart = await Cart.findOne();

        if (cart) {
            const productIndex = cart.products.findIndex(p => p.product.equals(id));
            if (productIndex > -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
            }
            const populatedCart = await Cart.findById(cart._id).populate('products.product').lean();
            res.status(200).send({ products: populatedCart.products });
        } else {
            res.status(404).send({ error: 'Cart not found' });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

export default router;
