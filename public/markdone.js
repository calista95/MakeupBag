function markDone(id){
	$.ajax({
		url: '/inventory/' + id,
		type: 'PUT', 
		data: $('#inventory').serialize(),
		success: function(result){
			window.location.replace("./");
		}
	})
};
