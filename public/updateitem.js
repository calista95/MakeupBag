function updateItem(id){
	    $.ajax({
		            url: '/inventory/' + id,
		            type: 'PUT',
		            data: $('#update-item').serialize(),
		            success: function(result){
			    window.location.replace("./");
	            		}
	        })
};
