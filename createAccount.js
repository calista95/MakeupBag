module.exports = function(){
	var express = require('express');
	var router = express.Router();

	//add a new user
	router.post('/', function(req, res){
		console.log(req.body);
		var mysql = "INSERT INTO user(fname, lname, 'password', email, username, phone) values(?,?,?,?,?,?)";
		var inserts = [req.body.fname, req.body.lname, req.body.password, req.body.email, req.body.username, req.body.phone];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if (error)
			{
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			else
			{
				res.redirect('/inventory');
			}
		
		});
	});



	return router; 
}();
