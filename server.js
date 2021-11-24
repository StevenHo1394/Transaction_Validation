
var express = require('express'),
    //cookieParser = require('cookie-parser'),
    session = require('express-session'),
    //passport = require("passport"),
    //LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    flash = require('express-flash');
    mysql = require('mysql2');

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
//app.use(cookieParser('whoopity whoopity whoop whoop'));
//app.use(passport.initialize());
//app.use(passport.session());
app.use(express.json());
express.urlencoded({ extended: true })

/*
var users = {
    "id123456" :  { id: 123456, username: "marcwan", password: "boo" },
    "id1" : { id: 1, username: "admin", password: "admin" }
};
*/

/*
function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/form");
    }
}
*/

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

/*
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
*/

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
        '        <p>Transaction Type:</>' +
        '        <select name = "txn_type">' +
        '               <option value = "Validator Creation Transaction">Validator Creation Transaction</option>' +
        '               <option value = "Delegation Transaction">Delegation Transaction</option>' +
	'               <option value = "Denom Creation Transaction">Denom Creation Transaction</option>' +			
	'               <option value = "NFT collection minting Transaction">NFT collection minting Transaction</option>' +		
	'               <option value = "Governance Proposal Voting Transaction">Governance Proposal Voting Transaction</option>' +	
        '        </select>' +
        '    </div>' +		
        '    <div>' +
        '        <label>Transaction Description:</label>' +
        '        <input type="text" name="txn_description"/>' +
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
        '        <label>Article URL:</label>' +
        '        <input type="text" name="article_url"/>' +
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

			console.log("discord_id=" + req.body.discord_id);
			console.log("txn_hash=" + req.body.txn_hash);
			console.log("txn_type=" + req.body.txn_type);
			console.log("txn_description=" + req.body.txn_description);
			console.log("txn_amount=" + req.body.txn_amount);
			console.log("twitter_url=" + req.body.twitter_url);
			console.log("valued_txn=" + req.body.valued_txn);
			console.log("total_txn=" + req.body.total_txn);
			console.log("amount_gained=" + req.body.amount_gained);
			console.log("article_url=" + req.body.article_url);

			var dbConfig = require('./config.js');
			var mysqlConnection = mysql.createConnection(dbConfig.databaseOptions);

			mysqlConnection.connect();
			mysqlConnection.on('error', function(err) {
   	 			console.log(err);
			});

			mysqlConnection.query(`BEGIN`);

			//console.log("insert into TransactionTypes table");

			//insert into Transactions table
			var insTransactionTypesStmt = `INSERT INTO TransactionTypes (name, description, amount) VALUES (?, ?, ?)`;
			var insTransactionTypesParm = [req.body.txn_type, req.body.txn_description, req.body.txn_amount];

			mysqlConnection.query(insTransactionTypesStmt, insTransactionTypesParm, (err, results, fields) => {
				if (err) {
					console.log("rollback on TransactionTypes table!");
					//mysqlConnection.query(`ROLLBACK`);
					//return console.error(err.message);
					//res.send("<b style='color: red'> " + err[0] + "</b><br/>");
					return mysqlConnection.rollback(function() {
                                                throw err;
                                        });
				}
				console.log("insert Id(Transaction Types):" + results.insertId);
			});
			//var lastInsId = mysqlConnection.query(`SELECT LAST_INSERT_ID()`)
			//lastInsId = lastInsId.toString()

			//insert into TransactionTypes table
			//var insTransactionStmt = `INSERT INTO Transactions (discord_id, transaction_hash, tid) VALUES (?, ?, ?)`;
			var insTransactionStmt = `INSERT INTO Transactions SET tid = (SELECT LAST_INSERT_ID()), discord_id = ?, transaction_hash = ?`;
			//var insTransactionParm = [req.body.discord_id, req.body.txn_hash, lastInsId]
			var insTransactionParm = [req.body.discord_id, req.body.txn_hash]

			mysqlConnection.query(insTransactionStmt, insTransactionParm, (err, results, fields) => {
                                if (err) {
                                        console.log("rollback on Transaction table!");
                                        //mysqlConnection.query(`ROLLBACK`);
                                        //return console.error(err.message);
                                        //res.send("<b style='color: red'> " + err[0] + "</b><br/>");
                                        return mysqlConnection.rollback(function() {
                                                throw err;
                                        });
                                }
                                console.log("insert Id(Transaction):" + results.insertId);
                        });

			//insert into TwitterPost table
			var insTwitterPostStmt = `INSERT INTO TwitterPost (discord_id, twitter_url) VALUES (?, ?)`;
			var insTwitterPostParm = [req.body.discord_id, req.body.twitter_url];

			mysqlConnection.query(insTwitterPostStmt, insTwitterPostParm, (err, results, fields) => {
                                if (err) {
					console.log("rollback on TwitterPost table!");
					//mysqlConnection.query(`ROLLBACK`);
                                        //return console.error(err.message);
					//res.send("<b style='color: red'> " + err[0] + "</b><br/>");
					return mysqlConnection.rollback(function() {
						throw err;
					});
                                }
                                console.log("insert Id(Twitter Post):" + results.insertId);
                        });

			//insert into ArticlePost table
                        var insArticlePostStmt = `INSERT INTO ArticlePost (discord_id, article_url) VALUES (?, ?)`;
                        var insArticlePostParm = [req.body.discord_id, req.body.article_url];

                        mysqlConnection.query(insArticlePostStmt, insArticlePostParm, (err, results, fields) => {
                                if (err) {
					console.log("rollback on ArticlePost table!");
					//mysqlConnection.query(`ROLLBACK`);
                                        //return console.error(err.message);
					return mysqlConnection.rollback(function() {
                                                throw err;
                                        });
                                }
                                console.log("insert Id(Article Post):" + results.insertId);
                        });

			//insert into Incentives_Gained table
                        var insIncentivesGainedStmt = `INSERT INTO Incentives_Gained (discord_id, valued_transactions, total_transactions, amount_gained) VALUES (?, ?, ?, ?)`;
                        var insIncentivesGainedParm = [req.body.discord_id, req.body.valued_txn, req.body.total_txn, req.body.amount_gained];

                        mysqlConnection.query(insIncentivesGainedStmt, insIncentivesGainedParm, (err, results, fields) => {
                                if (err) {
					console.log("rollback on Incentives_Gained table!");
					//mysqlConnection.query(`ROLLBACK`);
                                        //return console.error(err.message);
					return mysqlConnection.rollback(function() {
                                                throw err;
                                        });
                                }
                                console.log("insert Id(Incentives Gained):" + results.insertId);
                        });
	
			console.log("committing...");
			//mysqlConnection.query(`COMMIT`);

			mysqlConnection.commit(function(err) {
				if (err) {
					return mysqlConnection.rollback(function(err) {
						throw err;
					});
				}
			});

			mysqlConnection.end();
		}
        );

/*
app.get("/members", authenticatedOrNot, function (req, res) {
    res.send("secret members only area!");
});
*/

app.listen(8080);

