steal(
    'can', 
    '/d3px/models/d3api.js',
    './init.ejs',
    './calculator.less',
    '/d3px/lib/d3lib.js',
    '/d3px/lib/utils.js',
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

                loadCompositePlayerProfile(D3API,battleTag,function(data){
                    var items = data.heroes[heroIndex].items._data;

                    // retrieve the bonuses
                    var bonuses = getBonuses(items);
                });


            },
        }
    );
});

/**
 * Compiles a horizontal aggregation of all affix bonuses.
 *
 * @method getBonuses
 * @param itemSet {Object} The item set for a hero.
 * @return {Object} The aggregation of the bonuses.
 */
function getBonuses(itemSet) {
    var bonuses = {},
        set_bonuses = {},
        attrs = {},
        gems = [];

    // collect bonuses from every item
    for (var itemType in itemSet) {

        // collect bonuses from raw attributes
        bonuses = collectBonuses(
            bonuses, 
            itemSet[itemType].attributesRaw._data, 
            itemType
        );
        // collect bonuses from gems
        gems = itemSet[itemType].gems;
        for (var i=0; i<gems.length; i++) {
            var gem = gems[i];
            attrs = gem.attributesRaw._data;
            bonuses = collectBonuses(
                bonuses, 
                gem.attributesRaw._data, 
                itemType+' gem['+i+']'
            );
        }
        // collect set rankings (if applicable)
        if (itemSet[itemType].set) {
            var set = itemSet[itemType].set._data;
            if (!set_bonuses[set.name]) {
                set_bonuses[set.name] = {
                    ranks: set.ranks,
                    acquired: 0
                };
            }
            set_bonuses[set.name].acquired++;
        }
    }
    // collect set bonuses
    bonuses = getSetBonuses(bonuses,set_bonuses);


    console.log(bonuses)
}
/**
 * Collects a post aggregation of all set bonuses given the 
 * compiled aggregation of gear bonuses and set item acquistions.
 *
 * @method getSetBonuses,
 * @param bonuses {Object} The bonuses dictionary.
 * @param set_bonuses {Object} The acquisition state of set bonuses.
 * @return {Object} The resulting bonuses dictionary.
 */
function getSetBonuses(bonuses,set_bonuses) {
    // calculate set discounts here:
    var set_discount = sumBonuses(bonuses,'Attribute_Set_Item_Discount');

    // see whether or not any set bonuses have been awarded
    for (var name in set_bonuses) {
        var acquired = set_bonuses[name].acquired;
        // 1-piece sets clearly don't get any bonuses
        if (acquired <= 1) {
            break;
        }
        // otherwise, we are highly eligible for a set bonus
        var ranks = set_bonuses[name].ranks;
        for (var i=0; i<ranks.length; i++) {
            var required = ranks[i].required - set_discount;
            if (acquired >= required) {
                // lets add this set bonus to the bonuses dictionary
                bonuses = collectBonuses(
                    bonuses, 
                    ranks[i].attributesRaw._data, 
                    name + ' rank['+i+']'
                );
            }
        }
    }
    return bonuses;
}

/*******************************************************************
 * AGGREGATION HELPERS
 *******************************************************************/
/**
 * Sums all the bonus values together.
 *
 * @method sumBonuses
 * @param bonuses {Object} The dictionary of bonuses.
 * @param affix {String} The identifier of the affix.
 * @return {Number} The value of the sum.
 */
function sumBonuses(bonuses,affix) {
    var sum = 0;
    if (bonuses[affix]) {
        for (var i=0; i<bonuses[affix].length; i++) {
            sum += bonuses[affix][i].value;
        }
    }
    return sum;
}
/**
 * Collect all the bonuses and applies them to an existing dictionary of
 * bonuses of the same key.
 *
 * @method collectBonuses
 * @param bonuses {Object} The bonuses dictionary.
 * @param attrs {Object} The dictionary of bonuses on the item.
 * @param src {String} The source of the bonus.
 * @return {Object} The bonuses dictionary after the additions.
 */
function collectBonuses(bonuses,attrs,src) {
    for (var affix in attrs) {
        if (!bonuses[affix]) {
            bonuses[affix] = [];
        }
        bonuses[affix].push({
            from: src,
            value: attrs[affix].min
        });
    }
    return bonuses;
}