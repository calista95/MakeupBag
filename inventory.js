module.exports = function(){
	var express = require('express');
	var router = express.Router();

	//get all items that are incomplete
	function getItems(res, mysql, context, complete){
	
		mysql.pool.query("SELECT * FROM makeup WHERE finished = 0", function(error, results, fields){
		if(error)
		{
			res.write(JSON.stringify(error));
			res.end();
		}
		context.items = results;
		complete();
		});
	}


	//get a single item
	function getItem(res, mysql, context, id, complete){
		var sql = "SELECT * from makeup WHERE id=?";
		var inserts = [id];
		mysql.pool.query(sql, inserts, function(error, results, fields){
			if (error)
			{
				res.write(JSON.stringify(error));
				res.end();
			}
			context.item = results[0];
			complete();
		});
	}

	//display all items
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context = {};
		context.jsscripts = ["deleteitem.js", "updateitem.js"];
		var mysql = req.app.get('mysql');
		getItems(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if (callbackCount >=1)
			{
				res.render('inventory', context);
			}
		
		}
	}); 

	//display one item for the purpose of updating item
	router.get('/:id', function(req, res){
		callbackCount = 0;
		var context = {};
		context.jsscripts = ["selecteditem.js", "updateitem.js"];
		var mysql = req.app.get('mysql');
		getItem(res, mysql, context, req.params.id, complete);
		function complete()
			{
				callbackCount++;
				if (callbackCount>=1)
				{
					res.render('update-item', context);
				}
			}
	
	
	});

	//URI that update data is sent in order to update an item
	router.put('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		console.log(req.body);
		console.log(req.params.id);
		var sql = "UPDATE makeup SET name=?, price=?, purchaseDate=?, expireDate=?, type=?, rating=?, comments=? WHERE id=?";
		var inserts = [req.body.name, req.body.price, req.body.purchaseDate, req.body.expireDate, req.body.type, req.body.rating, req.body.comments, req.params.id];
		sql=mysql.pool.query(sql, inserts, function(error, results, fields){
			if (error){
				console.log(error);
				res.write(JSON.stringify(error));
				res.end();
			}
			else{
				res.status(200);
				res.end();
			}
		
		});
	
	});

	//delete an item
	router.delete('/:id', function(req, res){
		var mysql = req.app.get('mysql');
		var sql = "DELETE FROM makeup WHERE id=?";
		var inserts = [req.params.id];
		sql = mysql.pool.query(sql, inserts, function(error, results, fields){
			if (error)
			{
				res.write(JSON.stringify(error));
				res.status(400);
				res.end();
			}
			else
			{
				res.status(202).end();
			}
		});
	});

	//add an item
	router.post('/', function(req, res){
               console.log(req.body);
               var mysql = req.app.get('mysql');
               var sql = "INSERT INTO makeup(name, price, purchaseDate, expireDate, type, rating, comments) VALUES(?,?,?,?,?,?,?)";
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
	                                res.redirect('/inventory');
	                        }

                });
        });
	return router;

}();
