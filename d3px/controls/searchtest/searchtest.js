steal('can', 'd3px/models/d3api.js', './init.ejs', './searchtest.less', 
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
                    var battleTag = can.trim(searchField.val());

                    // clear the input field
                    searchField.val('');

                    // process the battleTag
                    var matches = battleTag.match(/(\w+)#(\d+)/);

                    // catch error cases
                    if (matches === null || matches.length != 3) {
                        console.error("Misformatted Battletag: "+battleTag);
                        return;
                    }

                    // perform a search against the D3 API for the corresponding battleTag
                    var searchQuery = matches[1] + '-' + matches[2];
                    D3API.getPlayerProfile({battleTag:searchQuery}).done(function(model){

                        console.log(model);

                        $('#playerProfile').html(can.view('/d3px/views/playerProfile/playerProfile.ejs', model._data));
                    });

                }
            }
        }
    );
});
