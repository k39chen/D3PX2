steal(
    'can', 
    '/d3px/models/d3api.js',
    './calculator.ejs',
    './calculator.less',
    '/d3px/lib/d3lib.js',
    '/d3px/lib/d3calc.js',
    '/d3px/lib/utils.js',
function(can, D3API, calculatorView) {    
    /**
     * Creates a test calculator for computing the attributes of a given hero.
     * 
     * @constructor d3px/controls/test/calculator
     * @alias Calculator
     * @parent d3px
     * @inherits can.Control
     */
	return can.Control(
        {
            defaults: {}
        },
        /**
         * Renders the initial template.
         */
        {
            init: function(){
                this.element.html(calculatorView());

                var battleTag = '';
                battleTag = 'GoodIdea-1513';
                //battleTag = 'pendragon#1365';
                //battleTag = 'gummypower#1650';
                battleTag = 'parallax#1878';
                var heroIndex = 0;

                // load a composite player profile
                loadCompositePlayerProfile(D3API,'us',battleTag,function(data){

                    console.log(data);

                });
            },
        }
    );
});
