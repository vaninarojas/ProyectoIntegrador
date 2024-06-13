import express from 'express';
import config from './config.js';
import productsRouter from './routes/products.routes.js';
import viewsRouter from './routes/views.routes.js';
import cartRouter from './routes/cart.routes.js';
import cookieRouter from './routes/cookies.routes.js';
import handlebars from 'express-handlebars';
import mongoose from "mongoose";
import initSocket from './sockets.js';
import sessionRouter from './routes/sessions.routes.js';
import usersRouter from './routes/users.routes.js';
import cookieParser from 'cookie-parser';
import session from 'express-session';
// import MongoStore from 'connect-mongo';
import passport from 'passport';
import FileStore from 'session-file-store';



const app = express()

const expressInstance = app.listen(config.PORT, async() => {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`App activa en puerto ${config.PORT} conectada a base de datos` );
});

const socketServer = initSocket(expressInstance);
app.set('socketServer', socketServer);

// const MongoStore = FileStore(session);
const fileStorage = FileStore(session);
    app.use(session({
        store: new fileStorage({ path: './sessions', ttl: 100, retries: 0 }),
        // store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 600 }),
        secret: config.SECRET,
        resave: false,
        saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.SECRET));
app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/users', usersRouter);
app.use('/api/cookies', cookieRouter);
app.use('/api/sessions', sessionRouter);

app.use('/static', express.static(`${config.DIRNAME}/public`));


