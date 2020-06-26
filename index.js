const express = require('express');
const handlebars = require('express-handlebars');
const serverless = require('serverless-http');

const app = express();
const hbs = handlebars.create({
    extname      :'handlebars',
    layoutsDir   : 'dist/view/layouts',
    defaultLayout: 'index',
    helpers      : 'dist/view/helpers',
    partialsDir  : [
        'dist/view/partials'
    ]
});
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        'hello': 'hi'
    });
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/dist/view');
app.use(express.static('dist'));
app.use('/.netlify/functions/index', router);

app.use(function(req, res){
        res.status(404);
    
        // respond with html page
        if (req.accepts('html')) {
        res.render('404', { url: req.url });
        return;
        }
    
        // respond with json
        if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
        }
    
        // default to plain-text. send()
        res.type('txt').send('Not found');
    });

module.exports.handler = serverless(app);
// const hbs = handlebars.create({
//     extname      :'handlebars',
//     layoutsDir   : 'dist/view/layouts',
//     defaultLayout: 'index',
//     helpers      : 'dist/view/helpers',
//     partialsDir  : [
//         'dist/view/partials'
//     ]
// });
// const PORT = process.env.PORT || 5000;

// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// app.set('views', __dirname + '/dist/view');
// app.use(express.static('dist'));

// app.get('/', (req, res) =>  {
//     res.render('home');
// });

// app.get('/home', (req, res) =>  {
//     res.render('home');
// });

// app.get('/news', (req, res) =>  {
//     res.render('news');
// });

// app.get('/verein', (req, res) =>  {
//     res.render('verein');
// });

// app.get('/team/:id', (req, res) =>  {
//     var teamId = req.params.id;
//     console.log(teamId);

//     res.render('team');
// });

// app.get('/kalender', (req, res) =>  {
//     res.render('calendar');
// });


// app.use(function(req, res){
//         res.status(404);
    
//         // respond with html page
//         if (req.accepts('html')) {
//         res.render('404', { url: req.url });
//         return;
//         }
    
//         // respond with json
//         if (req.accepts('json')) {
//         res.send({ error: 'Not found' });
//         return;
//         }
    
//         // default to plain-text. send()
//         res.type('txt').send('Not found');
//     });

// app.listen(PORT, () => console.log(`server running on port ${PORT}`));
