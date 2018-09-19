module.exports = function(){
	var express = require('express');
	var router = express.Router();

	  function getItems(res, mysql, context, complete){
		 mysql.pool.query("SELECT * FROM makeup", function(error, results, fields){
		 if(error)
		    {
		       res.write(JSON.stringify(error));
		       res.end();
		    }
		    context.items = results;
		    complete();
		    });
	      }

	router.get('/', function(req, res){
                var callbackCount = 0;
                var context = {};
                context.jsscripts = ["deleteitem.js", "updateitem.js"];
                var mysql = req.app.get('mysql');
                getItems(res, mysql, context, complete);
                function complete(){
                       callbackCount++;
                        if (callbackCount >=1)
                           res.render('addItem', context);
                }
	});

	//add an item, redirect to inventory page after adding
	router.post('/', function(req, res){
		console.log(req.body);
		var mysql = req.app.get('mysql');
		var sql = "INSERT INTO makeup(name, price, purchaseDate, expireDate, type, rating, comments, finished) VALUES(?,?,?,?,?,?,?, 0)";
		var inserts = [req.body.name, req.body.price, req.body.purchaseDate, req.body.expireDate, req.body.type, req.body.rating, req.body.comments];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if (error)
			{
				console.log(JSON.stringify(error));
				res.write(JSON.stringify(error));
				res.end();
			}
			else
			{
				res.redirect('/addItem');
			}
		
		});
	});
	


	return router;
}();
