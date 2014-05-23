steal(
    'can',
    'd3px/controls/pages/splash/init.ejs',
    'd3px/controls/pages/splash/splash.less',
function(can, initView) {    
    /**
     * The controller for handling the loading and interactions of the splash page.
     * 
     * @constructor d3px/controls/pages/splash
     * @alias SplashPage
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {}
        },
        {
            /**
             * Renders the initial template.
             */
            init: function(){
                this.element.html(initView());
            }
        }
    );
});
