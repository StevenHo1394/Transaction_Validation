# Transaction_Validation
A simple node.js web server to collect transaction validation information from users. After the user has filled the form and submitted it, the data will be stored in the correspinding DB tables in the server.

Usage:

Install mysql server on your machine and create a user (c.f. https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04).

Clone this repo, go the the folder you just cloned and execute the following in the command prompt of your machine:

Run "npm install"

Run the sql script "create_db.sql" (e.g. mysql -u {yourusername} -p < create_db.sql)

Run the sql script "create_tables.sql" (e.g. mysql -u {yourusername} -p TxnValidation < create_tables.sql)

Run "npm server.js". 

Open browser and visit http://localhost:8080/form. Of course, you can open the browser on another machine, just change the ip of the link accordingly.
