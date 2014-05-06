steal('can', 'd3px/models/d3api.js', './init.ejs', './d3api.less', 
    function(can, D3API, initView) {
    	return can.Control(
            {
                defaults: {
                    D3API: D3API
                }
            },
            {
                init: function(){
                    var el = this.element;

                    D3API.findBattletag({battletag:'gummypower-1650'}).done(function(model){
                        el.html(can.view('./controls/d3api/init.ejs', model));
                    });
                }
            }
        );
    }
);