/**
 * Loads player profile with everything included
 *
 * @method loadCompositePlayerProfile
 * @param D3API {can.Model} The D3 API model.
 * @param region {String} The region.
 * @param battleTag {String} The player battletag.
 * @param cb {Function} The response callback function.
 * @param logging {Boolean} Flag for logging details
 * @return {Object} The raw player profile data.
 */
function loadCompositePlayerProfile(D3API, region, battleTag, cb, logging) {
    loadCompositePlayerProfileCore(D3API, region, battleTag, function(data){
        // compute the attributes for all the heroes after all the items and info have been loaded
        if (data && data.heroes) {
            for (var i=0; i<data.heroes.length; i++) {
                var hero = data.heroes[i];

                // compute the attributes that the hero has with the gear set
                var attributes = computeAttributes(hero);

                // append this result to the heroes data response
                data.heroes[i].stats = attributes;
            }
        }
        // now we will return the absolute, most complete response
        if (cb) cb(data);
    }, logging);
}
/**
 * Loads player profile with everything included, except the attributes...
 *
 * @method loadCompositePlayerProfileCore
 * @param D3API {can.Model} The D3 API model.
 * @param region {String} The region.
 * @param battleTag {String} The player battletag.
 * @param cb {Function} The response callback function.
 * @param logging {Boolean} Flag for logging details
 * @return {Object} The raw player profile data.
 */
function loadCompositePlayerProfileCore(D3API, region, battleTag, cb, logging) {

    // current number of active requests
    var activeRequests = 0;

    // this is our ongoing return response
    var response = {};

    // load the player profile with associated battletag
    if (logging) {
        console.log('Loading player {battleTag:'+battleTag+'}');
    }
    D3API.getPlayerProfile({
        region: region,
        battleTag: battleTag
    }).done(function(playerData){

        // premature exit if no player is found
        if (!playerData.battleTag) {
            if (cb) cb({
                battleTag: battleTag,
                region: region,
                error: 'NOPLAYERFOUND'
            });
            return;
        }

        // build the response
        response = playerData;

        // load all the heroes owned by this player
        for (var i=0; i<playerData.heroes.length; i++) {
            var heroId = playerData.heroes[i].id;

            // start tracking this request
            activeRequests++;

            // load the hero profile
            if (logging) {
                console.log('Loading hero {battleTag:'+battleTag+',id:'+heroId+'}');
            }
            D3API.getHeroProfile({
                region: region,
                battleTag: battleTag,
                id: heroId
            }).done(function(heroData){

                // finished this request
                activeRequests--;

                // find the index at which the hero resides
                for (var h_ind=0; h_ind<response.heroes.length; h_ind++) {
                    if (response.heroes[h_ind].id == heroData.id) break;
                }
                // extend the response data
                response.heroes[h_ind] = can.extend(response.heroes[h_ind],heroData);

                // load all the items owned by this hero
                if (logging) {
                    console.log('Loading items for '+heroData.id+' ['+Object.keys(heroData.items._data).length+']');
                }
                for (var type in heroData.items._data) {
                    var itemdata = heroData.items._data[type].tooltipParams;

                    // start tracking this request
                    activeRequests++;

                    // load the item data
                    D3API.getItemData({
                        region: region,
                        itemdata: itemdata,
                        ext: {
                            heroId: heroData.id,
                            heroIndex: h_ind,
                            itemType: type
                        }
                    }).done(function(itemData){

                        // extend the response data
                        var it_ind = itemData.heroIndex,
                            it_type = itemData.itemType;
                        response.heroes[it_ind].items[it_type] = can.extend(
                            response.heroes[it_ind].items[it_type],
                            itemData
                        );

                        // finished this request
                        activeRequests--;

                        // we are done loading everything in this player profile, return the response
                        // through an asynchronous callback supplied by the user
                        if (activeRequests == 0) {
                            if (cb) cb(response);
                        }
                    });
                }
            });
        }
    });
}
/**
 * Provides displayable strings from API formatted strings.
 *
 * @method D
 * @param str {String} The string that we want to translate.
 * @return {String} The result of the lookup.
 */
function D(str) {
    switch (str) {
        case 'monk':
            return 'Monk';
        case 'demon-hunter':
            return 'Demon Hunter';
        case 'witch-doctor':
            return 'Witch Doctor';
        case 'barbarian':
            return 'Barbarian';
        case 'crusader':
            return 'Crusader';
        case 'wizard':
            return 'Wizard';
        case 'female':
            return 'Female';
        case 'male':
            return 'Male';
        default:
            return str;
    }
}
/**
 * Determines gender from integer.
 *
 * @method getGender
 * @param num {Number} The gender identifer.
 * @return {String} The gender as a string.
 */
function getGender(num) {
    switch (num) {
        case 0: return 'male';
        case 1:
        default: return 'female';
    }
}