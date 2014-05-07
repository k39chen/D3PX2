steal(
    'can', 
    '/d3px/models/d3api.js', 
    '/d3px/controls/test/heroselect/heroselect.js',
    './init.ejs',
    '/d3px/views/test/playerProfile.ejs',
    './searchbar.less', 
function(can, D3API, HeroSelect, searchView, playerView) {
    var ENTER_KEY = 13;
	return can.Control(
        {
            defaults: {}
        },
        {
            init: function(){
                this.element.html(searchView());
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
                    D3API.getPlayerProfile({battleTag:searchQuery}).done(function(data){
                        console.log('FETCHED PLAYER DATA: ',data);
                        $('#playerProfile').html(playerView(data));
                        
                        // create the hero select controller
                        var heroSelect = new HeroSelect('#heroselect', {data:data});
                    });
                }
            }
        }
    );
});
