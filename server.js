
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

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


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
    res.send('Form filled success!');
});

app.get('/fail/:errMessage', function(req, res) {
    //console.log(req.flash());
    //res.send('Form failed!\n' + errMessage);

    res.send(
	'<html>' + 
	'<p>Form failed!</p>' +
	'<p>' + errMessage + '</p>' + 
	'</html>'
		);
});

app.post("/form",  async function (req, res) {

			async function insertFormData2DB (req, res) {
				await console.log("entered insertFormDataDB");

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

				const conn = await mysql.createConnection(dbConfig.databaseOptions);
				var result = true;
				var errMessage = null;
				var insTwitterPostParm = [req.body.discord_id, req.body.twitter_url];

				try {
					await conn.query('START TRANSACTION');

                                        var insTwitterPostStmt = `INSERT INTO TwitterPost (discord_id, twitter_url) VALUES (?, ?)`;

					await console.log("parms = " + insTwitterPostParm[0] + ", " + insTwitterPostParm[1] );
                                        await conn.execute(insTwitterPostStmt, insTwitterPostParm);

					var insTransactionTypesStmt = `INSERT INTO TransactionTypes (name, description, amount) VALUES (?, ?, ?)`;
                        		var insTransactionTypesParm = [req.body.txn_type, req.body.txn_description, req.body.txn_amount];

					await conn.execute(insTransactionTypesStmt, insTransactionTypesParm);

					var insTransactionStmt = `INSERT INTO Transactions SET tid = (SELECT LAST_INSERT_ID()), discord_id = ?, transaction_hash = ?`;
                        		var insTransactionParm = [req.body.discord_id, req.body.txn_hash];

					await conn.execute(insTransactionStmt, insTransactionParm);

					var insArticlePostStmt = `INSERT INTO ArticlePost (discord_id, article_url) VALUES (?, ?)`;
                        		var insArticlePostParm = [req.body.discord_id, req.body.article_url];

					await conn.execute(insArticlePostStmt, insArticlePostParm);

					var insIncentivesGainedStmt=`INSERT INTO Incentives_Gained (discord_id, valued_transactions, total_transactions, amount_gained) VALUES (?, ?, ?, ?)`;
                        		var insIncentivesGainedParm = [req.body.discord_id, req.body.valued_txn, req.body.total_txn, req.body.amount_gained];

					await conn.execute(insIncentivesGainedStmt, insIncentivesGainedParm);

                                }
                                catch (err) {
                                        await console.log("Error in inserting! Error message = " + err.message);
					errMessage = err.message

					await console.log("result chkpt1 = " + result);
					result = false;
					await console.log("result chkpt2 = " + result);
                                }

				await console.log("result chkpt3 = " + result);

				if (result == true) {
					await console.log("No problem during insert! Committing...");
					await conn.execute(`COMMIT`);
					await conn.end();
				} else {
					await console.log("Rollback...");
					await conn.query(`ROLLBACK`);
					await conn.end();
				}

				return [result, errMessage];
			};

			[result, errMessage] = await insertFormData2DB(req, res);

			//result = insertFormData2DB(req, res);
			await console.log("result chkpt4 = " + result);

			if ( result == true) {
				await console.log("chkpt 5");
                        	return res.redirect('/success');
                        } else {
				await console.log("chkpt 6");
                                return res.redirect('/fail/' + errMessage);
                        }

		}
        );

app.listen(8080);

