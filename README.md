# Transaction_Validation
A simple node.js web server to collect transaction validation information from users. After the user has filled and submitted it, the data will be stored in the correspinding DB tables in the server.

Usage:

Install mysql server on your server and create a DB user with {yourusername} and {yourpassword} (c.f. https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04).

Clone this repo, go the the folder you just cloned and execute the following in the command prompt of your server:

Run "npm install"

Run the sql script "create_db.sql" (e.g. mysql -u {yourusername} -p < create_db.sql)

Run the sql script "create_tables.sql" (e.g. mysql -u {yourusername} -p TxnValidation < create_tables.sql)

In "server.js", modifiy the following according to {yourusername} and {yourpassword}:

  var connection = mysql.createConnection({     
    host     : 'localhost',       
    user     : 'yourusername',              
    password : 'yourpassword',       
    port: '3306',                   
    database: 'TxnValidation' 
  }); 

Run "npm server.js". 

Open browser and visit http://localhost:8080/form. Of course, you can open the browser on another machine, just change the "localhost" to your server's ip.
