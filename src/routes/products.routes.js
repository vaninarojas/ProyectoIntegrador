import { Router } from 'express';
import config from '../config.js';
import productsModel from '../models/products.model.js';
import { uploader } from '../uploader.js';



const router = Router();

router.get('/', async (req, res) => {
    try {
     
        const { limit = 10, page = 1, sort, category, available } = req.query;

      
        let queryOptions = {};

        
        if (category) {
            queryOptions.category = category;
        }

      
        if (available !== undefined) {
            queryOptions.available = available;
        }

      
        let sortOptions = {};
        if (sort) {
            sortOptions = { price: sort === 'asc' ? 1 : -1 };
        }

   
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sortOptions
        };

        res.render('products', {
            products: result.docs,
            user: req.session.user || null
        });
        res.status(200).send({
            status: 'success',
            payload: result.docs, user,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&category=${category}&available=${available}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&category=${category}&available=${available}` : null
        });
    } catch (err) {
      
        res.status(500).send({
            status: 'error',
            payload: null,
            totalPages: null,
            prevPage: null,
            nextPage: null,
            page: null,
            hasPrevPage: false,
            hasNextPage: false,
            prevLink: null,
            nextLink: null,
            error: err.message
        });
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
