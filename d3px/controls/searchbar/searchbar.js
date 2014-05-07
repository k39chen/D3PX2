steal('can', 'd3px/models/d3api.js', './init.ejs', './searchbar.less', 
function(can, D3API, initView) {
    var ENTER_KEY = 13;
	return can.Control(
        {
            defaults: {
                D3API: D3API
            }
        },
        {
            init: function(){
                this.element.html(initView());
            },
            keyup: function(el,ev) {
                if (ev.keyCode === ENTER_KEY) {

                    var searchField = $('input',el);
                    var battletag = can.trim(searchField.val());

                    // clear the input field
                    searchField.val('');

                    // process the battletag
                    var matches = battletag.match(/(\w+)#(\d+)/);

                    // catch error cases
                    if (matches === null || matches.length != 3) {
                        console.error("Misformatted Battletag: "+battletag);
                        return;
                    }

                    // perform a search against the D3 API for the corresponding battletag
                    var searchQuery = matches[1] + '-' + matches[2];
                    D3API.findBattletag({battletag:searchQuery}).done(function(model){

                        console.log(model);

                        $('#playerProfile').html(can.view('./views/playerProfile/playerProfile.ejs', model._data));
                    });

                }
            }
        }
    );
});