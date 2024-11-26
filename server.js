const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const seedAll = require('./seeds');


const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ partialsDir: path.join(__dirname, 'views/partials') });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

const sess= {
    secret: 'some secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    }),

};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.user_id = req.session.user_id || null;
    next();
  });

app.use(routes);

const startServer = async () => {
    await seedAll(); // Run the seed script
  
    sequelize.sync({ force: false }).then(() => {
      app.listen(PORT, () => console.log('Now listening'));
    });
  };
  
  startServer();