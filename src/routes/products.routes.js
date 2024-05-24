import { Router } from 'express';
import config from '../config.js';
import productsModel from '../dao/models/products.model.js';
import { uploader } from '../uploader.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsModel.find().lean();

        res.status(200).send({ origin: config.SERVER, payload: products });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post('/', uploader.single('thumbnail'), async (req, res) => {
    try {
        const socketServer = req.app.get('socketServer');
        const newProduct = await productsModel.create(req.body);
        
        res.status(200).send({ origin: config.SERVER, payload: newProduct });

        socketServer.emit('newProduct', req.body);
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const process = await productsModel.findOneAndUpdate(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = { _id: req.params.id };
        const deletedProduct = await productsModel.findByIdAndDelete(productId);

        res.status(200).send({ origin: config.SERVER, payload: deletedProduct });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


export default router;
