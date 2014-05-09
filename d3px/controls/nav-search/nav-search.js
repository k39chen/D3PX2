steal('can',
	  './init.ejs',
	  '/d3px/controls/profile-heroes/profile-heroes.js',
	  '/d3px/controls/profile-career/profile-career.js',
	  '/d3px/models/d3api.js',
	  '/d3px/lib/utils.js',
	  './init.less',
	   function(can, view, profileHeroes, profileCareer, D3API) {
	
	var ENTER_KEY = 13;
	
	return can.Control({
			defaults: {
			}
		}, {
			init: function() {
				// Add to view
				$('#navbar #search-module').html(view());
				
				// Interactions
				$("#region-dropdown").hover(function() {
					console.log("Hover");
					$(this).stop().animate({height: 180}, 100); // 5 regions x 36 height
				}, function() {
					$(this).stop().animate({height: 36}, 100);
				});
				
				$(".region").hover(function() {
					$(this).addClass("hover");
				}, function() {
					$(this).removeClass("hover");
				})
				
				$(".region").click(function() {
					
					// Change selected region
					var selectedRegion = $(this).html();
					$("#selected-region").empty().html(selectedRegion);
					$('#region-dropdown').stop().animate({height: 36}, 100);
				});
			},
			'#search-input keyup': function(el,ev) {
                if (ev.keyCode === ENTER_KEY) {
                
                	// Get battletag
                	var battletag = el.val();
                	var region = $("#selected-region").html().toLowerCase();
                	
                	// Show loader
                	$('#mask').fadeIn(200);
                	$('#loader').animate({opacity: 1}, 50);
                	
                	// Find player on Battle.net
                	loadCompositePlayerProfile(D3API, region, battletag, function(data) {
				
						console.log(data);
						new profileHeroes(null, {data: data});
					    new profileCareer(null, {data: data});
						
						// Set Welcome message
						$("#navbar #tag").html("Welcome " + data.battleTag);						
						$('#mask').fadeOut(500);
					});
				    
				    el.val('');
                }
			}
		});
	});