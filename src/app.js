import express from 'express';
import config from './config.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import handlebars from 'express-handlebars';
import mongoose from "mongoose";
import initSocket from './sockets.js';


const app = express()

const expressInstance = app.listen(config.PORT, async() => {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`App activa en puerto ${config.PORT} conectada a base de datos` );
});

const socketServer = initSocket(expressInstance);
app.set('socketServer', socketServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/static', express.static(`${config.DIRNAME}/public`));


