const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    extname      :'handlebars',
    layoutsDir   : 'dist/view/layouts',
    defaultLayout: 'index',
    helpers      : 'dist/view/helpers',
    partialsDir  : [
        'dist/view/partials'
    ]
});

module.exports = hbs;