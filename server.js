
var express = require('express'),
    //cookieParser = require('cookie-parser'),
    session = require('express-session'),
    //passport = require("passport"),
    //LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    flash = require('express-flash'),
    dbConfig = require('./config.js'),
    mysql = require('mysql2/promise'),
    HttpStatus = require('http-status-codes');

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

app.get('/success', function(req, res) {
    //console.log(req.flash());
    res.send('form filled success!');
});

app.get('/fail', function(req, res) {
    //console.log(req.flash());
    res.send('form failed!');
});

app.post("/form",  function (req, res) {

			/*			
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
			*/

			//var dbConfig = require('./config.js');
			//var mysqlConnection = mysql.createConnection(dbConfig.databaseOptions);

			async function insertFormData2DB (req, res) {
				console.log("entered insertFormDataDB");

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

				const conn = await mysql.createConnection(dbConfig.databaseOptions);
				var result = true;
				var insTwitterPostParm = [req.body.discord_id, req.body.twitter_url];

				try {
					await conn.query('START TRANSACTION');

                                        var insTwitterPostStmt = `INSERT INTO TwitterPost (discord_id, twitter_url) VALUES (?, ?)`;

					console.log("parms = " + insTwitterPostParm[0] + ", " + insTwitterPostParm[1] );
                                        await conn.execute(insTwitterPostStmt, insTwitterPostParm);
                                }
                                catch (err) {
                                        console.log("error in inserting. Error message = " + err.message);

					console.log("result chkpt1 = " + result);
					result = false;
					console.log("result chkpt2 = " + result);
                                }

				console.log("result chkpt3 = " + result);

				if (result == true) {
					console.log("No problem during insert! Committing...");
					await conn.execute(`COMMIT`);
					await conn.end();
				} else {
					console.log("Rollback...");
					await conn.query(`ROLLBACK`);
					await conn.end();
				}

				return result;
			};

			result = insertFormData2DB(req, res);
			console.log("result chkpt4 = " + result);

			if (result == true) {
				return res.redirect('/success');
			}
			else {
				return res.redirect('/fail');
			}

			//return res.redirect('/success');
			//return res.redirect('/fail');

			mysqlConnection.connect();
			
			mysqlConnection.on('error', function(err) {
   	 			console.log("error event = " + err);
			});
			
			mysqlConnection.query(`BEGIN`, function(err) {
				if (err) {
                                        return mysqlConnection.rollback(function(err) {
                                                //throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
                                }
                        });

			//insert into TwitterPost table
                        async function twitterPostInsert() {

				console.log("entered twitterPostInsert()")

                                try {
					var insTwitterPostStmt = `INSERT INTO TwitterPost (discord_id, twitter_url) VALUES (?, ?)`;
                        		var insTwitterPostParm = [req.body.discord_id, req.body.twitter_url];
                                        await mysqlConnection.query(insTwitterPostStmt, insTwitterPostParm);
                                }
                                catch (err) {
                                        console.log("error in inserting twitter post!");
                                        mysqlConnection.rollback();
                                        throw err;
                                }                        
			}

			twitterPostInsert();

			//insert into TransactionTypes table
			var insTransactionTypesStmt = `INSERT INTO TransactionTypes (name, description, amount) VALUES (?, ?, ?)`;
			var insTransactionTypesParm = [req.body.txn_type, req.body.txn_description, req.body.txn_amount];

			async function transactionTypesInsert() {
				await mysqlConnection.query(insTransactionTypesStmt, insTransactionTypesParm, function (err, results, fields) {
                                if (err) {
                                        console.log("rollback on TransactionTypes table!");
                                        return mysqlConnection.rollback(function() {
                                                //throw err;
                                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
                                }
                                console.log("insert Id(Transaction Types):" + results.insertId);
                        	});
			}

			/*
			mysqlConnection.query(insTransactionTypesStmt, insTransactionTypesParm, function (err, results, fields) {
				if (err) {
					console.log("rollback on TransactionTypes table!");
					return mysqlConnection.rollback(function() {
                                                //throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
				}
				console.log("insert Id(Transaction Types):" + results.insertId);
			});
			*/

			//insert into Transactions table
			var insTransactionStmt = `INSERT INTO Transactions SET tid = (SELECT LAST_INSERT_ID()), discord_id = ?, transaction_hash = ?`;
			var insTransactionParm = [req.body.discord_id, req.body.txn_hash]

			async function transactionsInsert() {
				await  mysqlConnection.query(insTransactionStmt, insTransactionParm, function (err, results, fields) {
                                if (err) {
                                        console.log("rollback on Transaction table!");
                                        return mysqlConnection.rollback(function() {
                                                //throw err;
                                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
                                }
                                console.log("insert Id(Transaction):" + results.insertId);
                        	}); 
			}

			/*
			mysqlConnection.query(insTransactionStmt, insTransactionParm, function (err, results, fields) {
                                if (err) {
                                        console.log("rollback on Transaction table!");
                                        return mysqlConnection.rollback(function() {
                                                //throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
                                }
                                console.log("insert Id(Transaction):" + results.insertId);
                        });
			*/

			/*
			mysqlConnection.query(insTwitterPostStmt, insTwitterPostParm, function (err, results, fields) {
                                if (err) {
					console.log("rollback on TwitterPost table!");
					return mysqlConnection.rollback(function() {
						//throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
					});
                                }
                                console.log("insert Id(Twitter Post):" + results.insertId);
                        });
			*/

			//insert into ArticlePost table
                        var insArticlePostStmt = `INSERT INTO ArticlePost (discord_id, article_url) VALUES (?, ?)`;
                        var insArticlePostParm = [req.body.discord_id, req.body.article_url];

			async function articlePostInsert() {
				await mysqlConnection.query(insArticlePostStmt, insArticlePostParm, function (err, results, fields) {
                                if (err) {
                                        console.log("rollback on ArticlePost table!");
                                        return mysqlConnection.rollback(function() {
                                                //throw err;
                                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
                                }
                                console.log("insert Id(Article Post):" + results.insertId);
                        	});
 
			}

			/*
                        mysqlConnection.query(insArticlePostStmt, insArticlePostParm, function (err, results, fields) {
                                if (err) {
					console.log("rollback on ArticlePost table!");
					return mysqlConnection.rollback(function() {
                                                //throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                        });
                                }
                                console.log("insert Id(Article Post):" + results.insertId);
                        });
			*/

			//insert into Incentives_Gained table
                        var insIncentivesGainedStmt = `INSERT INTO Incentives_Gained (discord_id, valued_transactions, total_transactions, amount_gained) VALUES (?, ?, ?, ?)`;
                        var insIncentivesGainedParm = [req.body.discord_id, req.body.valued_txn, req.body.total_txn, req.body.amount_gained];

			async function incentivesGainInsert() {
				await mysqlConnection.query(insIncentivesGainedStmt, insIncentivesGainedParm, function (err, results, fields) {
                                if (err) {
                                        console.log("rollback on Incentives_Gained table!");
                                        return mysqlConnection.rollback(function() {
                                                //throw err;
                                                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
                                                console.log("shouldn't reach here!")
                                        });
                                }
                                console.log("insert Id(Incentives Gained):" + results.insertId);
                        	});
			}

			/*
                        mysqlConnection.query(insIncentivesGainedStmt, insIncentivesGainedParm, function (err, results, fields) {
                                if (err) {
					console.log("rollback on Incentives_Gained table!");
					return mysqlConnection.rollback(function() {
                                                //throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
						//return res.send("Error!");
						console.log("shouldn't reach here!")
						//throw new Error('my error');
						//next(err);
						//throw { status: 404, message: 'Not supported' }
						//res.status(401, "Authentication mismatch").json({});
                                        });
                                }
                                console.log("insert Id(Incentives Gained):" + results.insertId);
                        });
			*/

			console.log("committing...");

			mysqlConnection.commit(function(err) {
				if (err) {
					return mysqlConnection.rollback(function(err) {
						//throw err;
						return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: err, message: err.message }); // 500
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

