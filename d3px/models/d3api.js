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

            // issue ajax call
            return $.ajax({
                type: 'GET', 
                dataType: 'jsonp',
                cache: true,
                url: url
            }).then(function(data){
                var formatted = formatPlayerProfileData(data);
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
         * @return {Object} The formatted hero profile data.
         */
        getHeroProfile: function(params) {
            var self = this,
                battleTag = params.battleTag,
                id = params.id,
                url = 'http://us.battle.net/api/d3/profile/'+battleTag+'/hero/'+id;

            // issue ajax call
            return $.ajax({
                type: 'GET', 
                dataType: 'jsonp',
                cache: true,
                url: url
            }).then(function(data){
                var formatted = formatHeroProfileData(data);
                return self.model(formatted);
            });
        },
        /**
         * Retrieves item data from D3 API.
         *
         * @method getItemData
         * @params {Object}
         *   - itemdata {String} The hash of the item data
         * @return {Object} The formatted item data.
         */
        getItemData: function(params) {
            var self = this,
                itemdata = params.itemdata,
                url = 'http://us.battle.net/api/d3/data/'+itemdata;

            // issue ajax call
            return $.ajax({
                type: 'GET', 
                dataType: 'jsonp',
                cache: true,
                url: url
            }).then(function(data){
                var formatted = formatItemData(data);
                return self.model(formatted);
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
    var ret = _mapAttributes(data, [
        'battleTag',
        'kills',
        'paragonLevel',
        'paragonLevelHardcore',
        'heroes'
    ]);
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
/**
 * Formats the hero profile data result.
 *
 * @method formatHeroProfileData
 * @params {Object} Raw hero profile data.
 * @return {Object} The formatted hero profile data.
 */
function formatHeroProfileData(data) {
    var ret = _mapAttributes(data, []);
    
    can.extend(data,{
        dps: 1234,
        toughness: 1234,
        healing: 1234
    });

    return data;
}
/**
 * Formats the item data result.
 *
 * @method formatItemData
 * @params {Object} Raw item data.
 * @return {Object} The formatted item data.
 */
function formatItemData(data) {
    var ret = _mapAttributes(data, []);
    return data;
}
/*******************************************************************
 * HELPERS
 *******************************************************************/
/**
 * Maps single layer attributes
 *
 * @private
 * @method _mapAttributes
 * @param data {Object} Raw response data.
 * @return {Object} Filtered response data.
 */
function _mapAttributes(data, mappings) {
    var ret = {};
    // set prelim mappings
    for (var i=0; i<mappings.length; i++) {
        var field = mappings[i],
            datum = data[field];
        // make sure that the data field that we are asking for exists
        if (datum) {
            ret[field] = data[field];   
        }
    }
    return ret;
}