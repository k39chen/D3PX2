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

                var battleTag = 'gummypower#1650';
                var heroIndex = 0;

                loadCompositePlayerProfile(D3API,'us',battleTag,function(data){
                    
                    var base = getBaseAttributes(data.heroes[heroIndex]);

                    console.log(base)

                    var items = data.heroes[heroIndex].items._data;

                    /*
                    // retrieve the bonuses
                    var bonuses = getBonuses(items);
                    */
                });


            },
        }
    );
});
/*******************************************************************
 * ATTRIBUTES TEMPLATES
 *******************************************************************/
function createAttributeTemplate(heroData) {
    // list sections
    var ordering = [
        'Core',
        'Offense',
        'Defense',
        'Life',
        'Resource',
        'Adventure'
    ];
    var template = {
        'Core': {
            'Strength':                     {value: 0, format: formatInteger()},
            'Dexterity':                    {value: 0, format: formatInteger()},
            'Intelligence':                 {value: 0, format: formatInteger()},
            'Vitality':                     {value: 0, format: formatInteger()}
        },
        'Offense': {
            'Bonus Damage to Elites':       {value: 0, format: formatPercentage()},
            'Attacks per Second':           {value: 0, format: formatFloat()},
            'Critical Hit Chance':          {value: 0, format: formatPercentage()},
            'Critical Hit Damage':          {value: 0, format: formatPercentage(2,'+')},
            'Area Damage':                  {value: 0, format: formatPercentage()},
            'Cooldown Reduction':           {value: 0, format: formatPercentage()}
        },
        'Defense': {
            'Armor':                        {value: 0, format: formatInteger()},
            'Block Amount':                 {value: 0, format: formatFloat()},
            'Block Chance':                 {value: 0, format: formatPercentage(1)},
            'Dodge Chance':                 {value: 0, format: formatPercentage(1)},
            'Physical Resistance':          {value: 0, format: formatInteger()},
            'Cold Resistance':              {value: 0, format: formatInteger()},
            'Fire Resistance':              {value: 0, format: formatInteger()},
            'Lightning Resistance':         {value: 0, format: formatInteger()},
            'Poison Resistance':            {value: 0, format: formatInteger()},
            'Arcane/Holy Resistance':       {value: 0, format: formatInteger()},
            'Crowd Control Reduction':      {value: 0, format: formatPercentage()},
            'Missile Damage Reduction':     {value: 0, format: formatPercentage()},
            'Elite Damage Reduction':       {value: 0, format: formatPercentage()},
            'Thorns':                       {value: 0, format: formatFloat()}
        },
        'Life': {
            'Maximum Life':                 {value: 0, format: formatInteger()},
            'Total Life Bonus':             {value: 0, format: formatPercentage(2,'+')},
            'Life per Second':              {value: 0, format: formatFloat()},
            'Life per Hit':                 {value: 0, format: formatFloat()},
            'Life per Kill':                {value: 0, format: formatFloat()},
            'Life Steal':                   {value: 0, format: formatPercentage()},
            'Health Globe Healing Bonus':   {value: 0, format: formatFloat()},
            'Bonus to Gold/Globe Radius':   {value: 0, format: formatFloat()}
        },
        'Resource': { /* class specific */ },
        'Adventure': {
            'Movement Speed':               {value: 0, format: formatPercentage(2,'+')},
            'Gold Find':                    {value: 0, format: formatPercentage(0,'+')},
            'Magic Find':                   {value: 0, format: formatPercentage(0,'+')},
            'Bonus Experience':             {value: 0, format: formatPercentage(1)},
            'Bonus Experience per Kill':    {value: 0, format: formatFloat()}
        }
    }
    switch (heroData['class']) {
        case 'barbarian':
            template['Life'] = {
                'Life per Fury Spent':              {value: 0, format: formatFloat()}
            };
            template['Resource'] = {
                'Maximum Fury':                     {value: 0, format: formatInteger()},
                'Fury Regeneration/Second':         {value: 0, format: formatFloat()},
                'Fury Cost Reduction':              {value: 0, format: formatPercentage(0)}
            };
            break;
        case 'crusader':
            template['Resource'] = {
                'Maximum Wrath':                    {value: 0, format: formatIntger()},
                'Wrath Regeneration/Second':        {value: 0, format: formatFloat()},
                'Wrath Cost Reduction':             {value: 0, format: formatPercentage(0)}
            };
            break;
        case 'monk':
            template['Life'] = {
                'Life per Spirit Spent':            {value: 0, format: formatFloat()}
            };
            template['Resource'] = {
                'Maximum Spirit':                   {value: 0, format: formatInteger()},
                'Spirit Regeneration/Second':       {value: 0, format: formatFloat()},
                'Spirit Cost Reduction':            {value: 0, format: formatPercentage(0)}
            };
            break;
        case 'demon-hunter':
            template['Resource'] = {
                'Maximum Hatred':                   {value: 0, format: formatInteger()},
                'Hatred Regeneration/Second':       {value: 0, format: formatFloat()},
                'Hatred Cost Reduction':            {value: 0, format: formatPercentage(0)},
                'Maximum Discipline':               {value: 0, format: formatInteger()},
                'Discipline Regeneration/Second':   {value: 0, format: formatInteger()},
                'Discipline Cost Reduction':        {value: 0, format: formatPercentage(0)}
            };
            break;
        case 'wizard':
            template['Resource'] = {
                'Maximum Arcane Power':             {value: 0, format: formatInteger()},
                'Arcane Regeneration/Second':       {value: 0, format: formatFloat()},
                'Arcane Power Cost Reduction':      {value: 0, format: formatPercentage(0)},
                'Arcane Power on Critical Hit':     {value: 0, format: formatInteger()}
            };
            break;
        case 'witch-doctor':
            template['Resource'] = {
                'Maximum Mana':                     {value: 0, format: formatInteger()},
                'Mana Regeneration/Second':         {value: 0, format: formatFloat()},
                'Mana Cost Reduction':              {value: 0, format: formatPercentage(0)}
            };
            break;
        default:
            break;
    }
    if (isDualWielding(heroData.items)) {
        template['Offense']['Attacks per Second Off Hand'] = {value: 0};
    }
    return template;
}
/**
 * Gets the base attributes dependent on which class
 */
function getBaseAttributes(heroData) {
    var base = createAttributeTemplate(heroData);

    // Core Attributes
    base['Core']['Strength'].value = 8;
    base['Core']['Dexterity'].value = 8;
    base['Core']['Intelligence'].value = 8;
    base['Core']['Vitality'].value = 9;

    // Offense Attributes
    base['Offense']['Attacks per Second'].value = 1.00;
    base['Offense']['Critical Hit Chance'].value = 0.05;
    base['Offense']['Critical Hit Damage'].value = 0.5;

    // class specific bases
    switch (heroData['class']) {
        case 'barbarian':
            base['Core']['Strength'].value = 10;
            base['Resource']['Maximum Fury'].value = 100;
            break;
        case 'crusader':
            base['Core']['Strength'].value = 10;
            base['Resource']['Maximum Wrath'].value = 130;
            base['Resource']['Wrath Regeneration/Second'].value = 2.50;
            break;
        case 'monk':
            base['Core']['Dexterity'].value = 10;
            base['Resource']['Maximum Spirit'].value = 130;
            break;
        case 'demon-hunter':
            base['Core']['Dexterity'].value = 10;
            base['Resource']['Maximum Hatred'].value = 125;
            base['Resource']['Hatred Regeneration/Second'].value = 4;
            base['Resource']['Maximum Discipline'].value = 30;
            base['Resource']['Discipline Regeneration/Second'].value = 1;
            break;
        case 'wizard':
            base['Core']['Intelligence'].value = 10;
            base['Resource']['Maximum Arcane Power'].value = 100;
            base['Resource']['Arcane Regeneration/Second'].value = 10;
            break;
        case 'witch-doctor':
            base['Core']['Intelligence'].value = 10;
            base['Resource']['Maximum Mana'].value = 150;
            base['Resource']['Mana Regeneration/Second'].value = 45;
            break;
        default:
            break;
    }
    return base;
}
/*******************************************************************
 * BONUS COLLECTION
 *******************************************************************/
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
 * FORMATTERS
 *******************************************************************/
/** 
 * Formats a number into a percentage.
 *
 * @method formatPercentage
 * @param decimals {Number} The number of decimal places. [default=2]
 * @param prefix {String} An optional prefix. [default='']
 * @return {String} The formatted number.
 */
function formatPercentage(decimals,prefix) {
    return {
        precision: (decimals === null || decimals === undefined) ? 2 : decimals,
        prefix: !prefix ? '' : prefix,
        postfix: '%',
        operation: function(num){return num*100;}
    }
}
/** 
 * Formats a number into a float.
 *
 * @method formatFloat
 * @param decimals {Number} The number of decimal places. [default=2]
 * @param prefix {String} An optional prefix. [default='']
 * @return {String} The formatted number.
 */
function formatFloat(decimals,prefix) {
    return {
        precision: (decimals === null || decimals === undefined) ? 2 : decimals,
        prefix: !prefix ? '' : prefix
    }
}
/** 
 * Formats a plain number.
 *
 * @method formatInteger
 * @param prefix {String} An optional prefix. [default='']
 * @return {String} The formatted number.
 */
function formatInteger(prefix) {
    return {prefix: !prefix ? '' : prefix};
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
/**
 * Determines whether a character is dual wielding.
 *
 * @method isDualWielding
 * @param items {Object} The items list.
 * @return {Boolean} Flag indicating whether or not the hero is dual wielding.
 */
function isDualWielding(items) {
    if (items['mainHand'] && items['offHand']) {
        if (items['mainHand'].dps != null && items['offHand'].dps != null) {
            return true;
        }
    }
    return false;
}