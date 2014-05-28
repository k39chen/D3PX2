steal(
    'can',
    'd3px/controls/pages/hero/subpages/attributes/attributes.ejs',
    'd3px/controls/pages/hero/subpages/attributes/attributes.less',
    'd3px/lib/d3calc.js',
function(can, attributesView) {    
    /**
     * The controller for handling the loading and interactions of the attributes subpage.
     * 
     * @constructor d3px/controls/pages/hero/subpages/attributes
     * @alias AttributesSubPage
     * @parent d3px
     * @inherits can.Control
     */
    return can.Control(
        {
            defaults: {
                data: null
            }
        },
        {
            /**
             * Renders the attributes template.
             */
            init: function(){
                var hero = this.options.data;

                // render the initial template
                this.element.empty().html(attributesView({
                    stats: hero.stats,
                    order: getTemplateOrder(hero)
                }));

                // by default open all the sections
                this.openAllSections(0);
            },
            '.attribute-section-title mouseover': function(el,ev) {
                el.addClass('hover');
            },
            '.attribute-section-title mouseout': function(el,ev) {
                el.removeClass('hover');
            },
            '.attribute-section-title click': function(el,ev) {
                var section = el.parent('.attribute-section').first().attr('section');

                if (this.isClosed(section)) {
                    this.openSection(section);
                } else {
                    this.closeSection(section);
                }
            },
            '.attribute-stat mouseover': function(el,ev) {
                el.addClass('hover');
            },
            '.attribute-stat mouseout': function(el,ev) {
                el.removeClass('hover');
            },
            /**
             * Opens all the attribute sections
             *
             * @method openAllSections 
             * @param duration {Number} The animation duration.
             */
            openAllSections: function(duration) {
                var order = getTemplateOrder(this.options.data);

                for (var i=0; i<order.sectionOrder.length; i++) {
                    var title = order.sectionOrder[i];
                    this.openSection(title,duration);
                }
            },
            /**
             * Opens an individual attribute section.
             *
             * @method openSection
             * @param section {String} The section identifier.
             * @param duration {Number} The animation duration.
             */
            openSection: function(section,duration) {
                var sectionDiv = $('.attribute-section[section="'+section+'"]');
                var contentDiv = $('.attribute-section-content',sectionDiv);
                var contentHeight = this.getContentHeight(section);
                var animDuration = (duration === undefined || duration === null) ? 200 : 0;

                // update the caret
                sectionDiv.removeClass('closed');

                // display the contents of the section
                contentDiv.css({opacity:0.0,height:0}).stop().animate({opacity:1.0,height:contentHeight},animDuration);
            },
            /**
             * Closes an individual attribute section.
             *
             * @method closeSection
             * @param section {String} The section identifier.
             * @param duration {Number} The animation duration.
             */
            closeSection: function(section,duration) {
                var sectionDiv = $('.attribute-section[section="'+section+'"]');
                var contentDiv = $('.attribute-section-content',sectionDiv);
                var contentHeight = this.getContentHeight(section);
                var animDuration = (duration === undefined || duration === null) ? 200 : 0;

                // update the caret
                sectionDiv.addClass('closed');

                // display the contents of the section
                contentDiv.css({opacity:1.0,height:contentHeight}).stop().animate({opacity:0.0,height:0},animDuration);
            },
            /**
             * Determines if an attribute section is closed.
             *
             * @method isClosed
             * @param section {String} The section identifier.
             * @return {Boolean} The result of the evaluation.
             */
            isClosed: function(section) {
                return $('.attribute-section[section="'+section+'"]').hasClass('closed');
            },
            /**
             * Get the content height.
             *
             * @method getContentHeight
             * @param section {String} The section identifier.
             * @return {Number} The content height. 
             */
            getContentHeight: function(section) {
                // the content div
                var contentDiv = $('.attribute-section[section="'+section+'"] .attribute-section-content');
                
                // cache the previous values before we change the value
                var prevDisplayHero = $('#hero-page').css('display'),
                    prevDisplayAttributes = $('#attributes-subpage').css('display'),
                    prevHeight = contentDiv.css('height');

                $('#hero-page').css('display','block');
                $('#attributes-subpage').css('display','block');

                var contentHeight = contentDiv.css('height','auto').outerHeight();

                // reinstate the previous values
                $('#hero-page').css('display',prevDisplayHero);
                $('#attributes-subpage').css('display',prevDisplayAttributes);
                contentDiv.css('height',prevHeight);

                return contentHeight;
            }
        }
    );
});
