# Transaction_Validation
A simple web server to collect transaction information from users. After user has filled the form and submitted it, the data will be stored in the correspinding tables.

Usage:
Run "npm install"

Run the sql script "create_db.sql" (e.g. mysql -u yourusername -p yourpassword yourdatabase < create_db.sql)

Run the sql script "create_tables.sql" (e.g. mysql -u yourusername -p yourpassword yourdatabase < create_db.sql)

Run "npm server.js". Open browser and visit http://localhost:8080/form
