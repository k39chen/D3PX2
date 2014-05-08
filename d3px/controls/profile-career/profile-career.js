steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'./init.less', function(can, D3API, careerView) {
		
		return can.Control({
			defaults: {}
		},
		{
			init: function() {
				// Get list of heroes from D3API
				var battleTag = 'GummyPower-1650';

			    D3API.getPlayerProfile({battleTag:battleTag}).done(function(data){
			        // here is the data:
			        console.log(data);
			        
			        // Insert into HTML (data includes completes hero attributes)
					$('#canvas').append(careerView(data));
			    });
			}
		});
		
	});