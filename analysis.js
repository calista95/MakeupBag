module.exports = function(){
	var express = require('express');
	var router = express.Router();
	
	//sum up items
	function getSum(res, mysql, context, complete){
		mysql.pool.query("SELECT SUM(price) AS total FROM makeup", function(error, results, fields){
			if (error)
			{
				res.write(JSON.stringify(error));
				res.end();
			}
			console.log(results[0].total);
			context.total = results[0].total;
			complete();
		});
	}

	//get all empties
	function getEmpties(res, mysql, context, complete){
		mysql.pool.query("SELECT COUNT(*) AS empties FROM makeup WHERE finished =1", function(error, results, fields){
			if (error)
			{
				res.write(JSON.stringify(error));
				res.end();
			}
			console.log(results);
			context.empties = results[0].empties;
			complete();
		});
	}

	//get all actives
	function getActives(res, mysql, context, complete){
		mysql.pool.query("SELECT COUNT(*) AS actives FROM makeup WHERE finished =0", function(error, results, fields){
			if (error)
			{
				res.write(JSON.stringify(error));
				res.end();
			}
			console.log(results);
			context.actives = results[0].actives;
			complete();
		});
	}


	//sum price of all items
	router.get('/', function(req, res){
		var callbackCount = 0;
		var context={};
		var mysql = req.app.get('mysql');
		getSum(res, mysql, context, complete);
		getEmpties(res, mysql, context, complete);
		getActives(res, mysql, context, complete);
		function complete(){
			callbackCount++;
			if (callbackCount >=3)
			{
				console.log(context);
				res.render('analysis', context);
			}
		}
	});

	return router;
}();


