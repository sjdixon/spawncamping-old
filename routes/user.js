
exports.signupForm = function (req, res) {
    res.render('signup', {
        title: 'Signup'
    });
};

exports.register = function (req, res) {
    // register new user in database
    req.session.login = null;
    helpers.login.validateAndCreate(req.body)
        .then(function(new_user){
            req.session.login = new_user.id;
            res.redirect("/feed");

        }, function(code, message){
            req.flash = ('error', message);
            res.redirect(code, "/users/new");
        });
};

exports.stream = function(req, res) {
    // get user stream
    res.send("sent photo stream for user :id");
};

exports.follow = function(req, res){
    // follow user stream with :id
    res.send("following :id stream");
};

exports.unfollow = function(req, res){
    res.send("unfollowing :id stream");
};

