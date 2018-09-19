var mysql = require('mysql');
var pool = mysql.createPool({

    		host:'localhost',
	        user:'root',
	        password:'root',
	        database: 'makeupdb'


});
module.exports.pool = pool;
