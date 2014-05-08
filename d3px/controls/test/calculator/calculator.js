steal(
    'can', 
    '/d3px/models/d3api.js',
    './init.ejs',
    './calculator.less', 
function(can, D3API, initView) {
	return can.Control(
        {
            defaults: {}
        },
        {
            init: function(){
                this.element.html(initView());

                var battleTag = 'gummypower-1650';
                var heroIndex = 0;

                // fetch the player profile
                D3API.getPlayerProfile({battleTag:battleTag}).done(function(playerData){
                    
                    // fetch the first hero profile
                    if (playerData.heroes.length > heroIndex) {
                        D3API.getHeroProfile({
                            battleTag:battleTag,
                            id:playerData.heroes[heroIndex].id
                        }).done(function(heroData){
                            
                        });
                    }

                });


            },
        }
    );
});
