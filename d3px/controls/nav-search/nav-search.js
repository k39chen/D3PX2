steal('can',
	  './init.ejs',
	  '/d3px/controls/profile-heroes/profile-heroes.js',
	  '/d3px/controls/profile-career/profile-career.js',
	  './init.less',
	   function(can, view, profileHeroes, profileCareer) {
	
	var ENTER_KEY = 13;
	
	return can.Control({
			defaults: {
			}
		}, {
			init: function() {
			
				// Add to view
				$('#navbar #search-module').html(view());
			},
			'#search-input keyup': function(el,ev) {
                if (ev.keyCode === ENTER_KEY) {
                	// Pass battletag and region and create panes
                	var battletag = el.val();
                	
                	new profileHeroes(null, {battletag: battletag});
				    new profileCareer(null, {battletag: battletag});
				    
				    el.val('');
                }
			}
		});
	});