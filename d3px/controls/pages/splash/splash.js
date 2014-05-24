steal(
    'can',
    'd3px/controls/pages/splash/splash.ejs',
    'd3px/controls/pages/splash/splash.less',
function(can, splashView) {    
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
             * Renders the splashial template.
             */
            init: function(){
                this.element.html(splashView());
            }
        }
    );
});
