
var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    flash = require('express-flash');

var app = express();

var session_configuration = {
    secret: 'whoopity whoopity whoop whoop',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
};

session_configuration.cookie.secure = false;

app.use(flash());
app.use(session(session_configuration));
app.use(cookieParser('whoopity whoopity whoop whoop'));
app.use(passport.initialize());
app.use(passport.session());


var users = {
    "id123456" :  { id: 123456, username: "marcwan", password: "boo" },
    "id1" : { id: 1, username: "admin", password: "admin" }
};

function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/form");
    }
}


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


passport.use(new LocalStrategy(
    function(username, password, done) {
        setTimeout(function () {
        for (userid in users) {
            var user = users[userid];
            console.log(user);
            if (user.username.toLowerCase() == username.toLowerCase()) {
                if (user.password == password) {
                    return done(null, user);
                }
            }
        }
        return done(null, false, { message: 'Incorrect credentials.' });
            }, 1000);
    }
));

passport.serializeUser(function(user, done) {
    if (users["id" + user.id]) {
        done(null, "id" + user.id);
    } else {
        done(new Error("WAT"));
    }
});

passport.deserializeUser(function(userid, done) {
    if (users[userid]) {
        done(null, users[userid]);
    } else {
        done(new Error("CANTFINDUSER"));
    }
});

app.get('/', function(req, res) {
    console.log(req.flash());
    res.send('<a href="/form">Fill the form here</a>');
});

app.get("/form", function (req, res) {

    var error = req.flash("error");

    var form = 
	'<form action="/form" method="post">' +
        /*'    <div>' +
        '        <label>Username:</label>' +
        '        <input type="text" name="username"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Password:</label>' +
        '        <input type="password" name="password"/>' +
        '    </div>' +
	*/
        '    <div>' +
        '        <label>Discord ID:</label>' +
        '        <input type="text" name="discord_id"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Transaction Hash:</label>' +
        '        <input type="text" name="txn_hash"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Transaction Type:</label>' +
        '        <input type="text" name="txn_type"/>' +
        '    </div>' +		
        '    <div>' +
        '        <label>Transaction Description:</label>' +
        '        <input type="text" name="txn_describtion"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Transaction Amount:</label>' +
        '        <input type="text" name="txn_amount"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Twitter URL:</label>' +
        '        <input type="text" name="twitter_url"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Valued Transactions:</label>' +
        '        <input type="text" name="valued_txn"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Total Transactions:</label>' +
        '        <input type="text" name="total_txn"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Amount Gained:</label>' +
        '        <input type="text" name="amount_gained"/>' +
        '    </div>' +
        '    <div>' +
        '        <input type="submit" value="Submit"/>' +
        '    </div>' +
        '</form>';

    if (error && error.length) {
        form = "<b style='color: red'> " + error[0] + "</b><br/>" + form;
    }

    res.send(form);
});

/*
app.post("/form",
         passport.authenticate('local', { successRedirect: '/members',
                                          failureRedirect: '/form',
                                          successFlash: { message: "welcome back" },
                                          failureFlash: true })
        );
*/

app.post("/form",  function (req, res) {
		 	console.log("form = " + res.get(form))
		}
        );


app.get("/members", authenticatedOrNot, function (req, res) {
    res.send("secret members only area!");
});


app.listen(8080);

