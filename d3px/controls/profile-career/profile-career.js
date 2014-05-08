steal(
	'can',
	'../../models/d3api.js',
	'./init.ejs',
	'./init.less', function(can, D3API, careerView) {
		
		return can.Control({
			defaults: {
				battletag: null
			}
		},
		{
			init: function() {

				// Loads player data
				loadCompositePlayerProfile(D3API, this.options.battletag, function(data) {
				
					$('#mask').fadeOut(500);
					$('#career-pane').html(careerView(data));
				
				});
			}
		});
		
	});