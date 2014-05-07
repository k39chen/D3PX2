steal('can', function (can) {
    /**
     * Wraps backend D3 API services.
     *
     * @constructor d3px/models/d3api
     * @alias D3API
     * @parent d3px
     * @inherits can.Model
     */
    return can.Model(
    /* @Static */
    {
        /**
         * Retrieves player profile data from D3 API.
         * 
         * @method getPlayerProfile
         * @params {Object}
         *   - battleTag {String} The battletag of the player
         * @return {Object} The formatted player profile data.
         */
        getPlayerProfile: function(params) {
            var self = this,
                battleTag = params.battleTag,
                url = 'http://us.battle.net/api/d3/profile/'+battleTag+'/';

            return $.ajax({
                type: 'GET', 
                dataType: 'jsonp', 
                url: url,
            }).then(function(data){
                var formatted = formatPlayerProfileData(data);

                self.getHeroProfile({battleTag:battleTag,id:data.heroes[0].id})

                return self.model(formatted);
            });
        },
        /** 
         * Retrieves hero profile data from D3 API.
         *
         * @method getHeroProfile
         * @params {Object}
         *   - battleTag {String} The battletag of hte plyaer
         *   - id {Number} The unique identifier for the hero
         */
        getHeroProfile: function(params) {
            var self = this,
                battleTag = params.battleTag,
                id = params.id,
                url = 'http://us.battle.net/api/d3/profile/'+battleTag+'/hero/'+id;

            return $.ajax({
                type: 'GET', 
                dataType: 'jsonp', 
                url: url,
            }).then(function(data){
                console.log(data);
                return self.model(data);
            });
        }
    }, 
    /* @Prototype */
    {});
});

/*******************************************************************
 * FORMATTERS
 *******************************************************************/
/** 
 * Formats the player profile data result
 *
 * @method formatPlayerProfileData
 * @params {Object} Raw player profile data.
 * @return {Object} The formatted player profile data.
 */
function formatPlayerProfileData(data) {
    var ret = {}, mappings = [
        'battleTag',
        'kills',
        'paragonLevel',
        'paragonLevelHardcore',
    ];
    // set prelim mappings
    for (var i=0; i<mappings.length; i++) {
        var field = mappings[i],
            datum = data[field];
        // make sure that the data field that we are asking for exists
        if (datum) {
            ret[field] = data[field];   
        }
    }
    // set time played mapping
    var tpsum = 0;
    ret.timePlayed = {};
    if (data.timePlayed) {
        // get the sum of time played across all classes
        for (var c in data.timePlayed) {
            tpsum += data.timePlayed[c];
        }
        // get the percentage value for each class
        for (var c in data.timePlayed) {
            ret.timePlayed[c] = data.timePlayed[c] / tpsum;
        }
    }
    return ret;
}