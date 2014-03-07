var path = require('path');

//These get used so much, they may as well be global
global.q = require('q');
global.extend = require('extend');
global.requireAll = require('require-all');
global.express = require('express');
global._ = require('underscore');
global.http = require('http');
global.flash = require('express-flash'); //For sending temporary messages to redirects
global.fs = require('fs'); //For file system calls
global.path = require('path');
global.url = require('url');
global.bcrypt = require('bcryptjs');
global.moment = require('moment');

//Global configuration settings
global.settings = {
    ROOT_DIR: process.cwd(),
    NODE_ENV: process.env.NODE_ENV,
    UPLOADS_PATH: 'public/uploads',
    UPLOADS_URL_PATH: '/photos/',
    //TODO change to password given by TA
    ADMIN_PASSWORD: 'temp_password', //Password given by TA for bulk upload security

    /*
     To use this connection string, run the following commands in your localhost mysql

     CREATE USER 'user'@'localhost';
     GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' WITH GRANT OPTION;
     SET PASSWORD FOR 'user'@'localhost' = PASSWORD('user');

     CREATE DATABASE seng_development;
     */
    db: {
        //NOTE!!!!!! config.json will need to be changed to reflect these changes (to perform migrations)
        TABLE: 'seng_development',
        USERNAME: 'user',
        PASSWORD: 'user',
        options: {
            host: 'localhost',
            port: 3306
        }
    }
};

//System functions/required modules
global.system = {
    pathTo: function (/**..args**/) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(settings.ROOT_DIR);
        return path.join.apply(null, args);
    },
    ext: requireAll(path.join(settings.ROOT_DIR, '/core/ext/'))
};

//Express configuration
global.app = express();
app.set('port', process.env.PORT || 8800);
app.set('views', system.pathTo('core/views/'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());

// Session Management
app.use(express.cookieParser());
app.use(express.session({secret: 'spawncampingsupersecuresession'}));

//Configure flash messages
app.use(flash());

//Helper functions for user login in Jade templates
app.use(function(req,res,next){
    /**
     * Indicates if the user is logged in
     * @returns {boolean}
     */
    res.locals.userLoggedIn = function () {
        return req.session.login;
    }

    //Direct access to logged in user object
    res.locals.user = req.session.login;

    next();
});

app.use(app.router);
app.use(express.static(system.pathTo('public/')));
app.use(settings.UPLOADS_URL_PATH, express.static(system.pathTo(settings.UPLOADS_PATH))); //Direct photo requests to uploads folder

// Load mode-specific configurations
switch (settings.NODE_ENV) {
    case 'development':
        require('./development.js');
        break;
    case 'production':
        require('./production.js');
        break;
    case 'test':
        require('./test.js');
        break;
}
require('./my_config'); //Load computer-specific configurations

global.helpers = requireAll(system.pathTo('/core/helpers/'));
global.classes = require(system.pathTo('/core/classes/'));
global.db = require(system.pathTo('core/models/'));

//Load routes configurations
require(system.pathTo('routes/config'));

//Create image upload directories, if they don't exist already
helpers.system.createImageUploadDirectories();

//Allow access to globals in Jade files
app.locals.db = db;