let express = require('express'),
    path = require('path'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    app = express(),
    expressSwagger = require('express-swagger-generator')(app),
    swaggerUi = require('express-swaggerize-ui'),
    parametersRoute = require('./routes/parameters.route'),
    applicationsRoute = require('./routes/applications.route'),
    conf = require("./conf/conf.json");

// Setting up port with express js
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/', express.static(path.join(__dirname, 'dist/mean-stack-crud-app')));
app.use('/' + conf.api.name + '/parameters', parametersRoute);
app.use('/' + conf.api.name + '/applications', applicationsRoute);

// Create port
const port = process.env.PORT || conf.api.port || 4000;
const server = app.listen(port, () => {
    console.log('Connected to port ' + port);
})

// Error handler
app.use(function(err, req, res, next) {
    console.error(err.message); // Log error message in our server's console
    if (!err.statusCode) err.statusCode = 500; // If err has no specified error code, set error code to 'Internal Server Error (500)'
    res.status(err.statusCode).send(err.message); // All HTTP requests must have a response, so let's send back an error with its status code and message
});

// Init swagger generator
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            description: 'REST API for ' + conf.api.name + ' applicative server.',
            title: conf.api.name,
            version: conf.api.version,
        },
        host: conf.api.address + ':' + conf.api.port,
        basePath: '/',
        produces: [
            "application/json"
        ],
        schemes: ['http', 'https'],
        url: '/swagger.json'
    },
    basedir: __dirname, //app absolute path
    files: ['./routes/**/*.js'] //Path to the API handle folder
};

var swaggerObject = expressSwagger(swaggerOptions);
app.use('/swagger.json', function(req, res) {
    res.json(swaggerObject);
});
app.use('/api-docs', swaggerUi({
    docs: '/swagger.json' // from the express route above.
}));
app.use('/', swaggerUi({
    docs: '/swagger.json' // from the express route above.
}));