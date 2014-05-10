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

                // load a composite player profile
                loadCompositePlayerProfile(D3API,'us',battleTag,function(data){
                    // compute the attributes that the hero has with the gear set
                    computeAttributes(data.heroes[heroIndex]);
                });
            },
        }
    );
});
/*******************************************************************
 * ATTRIBUTES TEMPLATES
 *******************************************************************/
/**
 * Creates a framework for the attribute template.
 *
 * @method createAttributeTemplate
 * @param heroData {Object} The hero data.
 * @return {Object} The template.
 */
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
 *
 * @method getBaseAttributes
 * @param heroData {Object} The hero data.
 * @return {Object} The template.
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
/**
 * Compute the attributes in the template.
 *
 * @method computeAttributes
 * @param heroData {Object} The hero data.
 * @return {Object} The computed attributes.
 */
function computeAttributes(heroData) {
    var stats = {
        hero: heroData,
        base: getBaseAttributes(heroData),
        bonuses: getBonuses(heroData.items._data)
    };
    var result = stats.base;

    // compute each section
    for (var title in stats.base) {
        var section = stats.base[title];

        // compute each attribute
        for (var attr in section) {
            result[title][attr].value = computeAttribute(attr,stats);
        }
    }
    return result;
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

    return bonuses;
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
    var set_discount = sumBonuses(bonuses['Attribute_Set_Item_Discount'])

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
 * @param bonusArray {Array} The array of bonuses.
 * @return {Number} The value of the sum.
 */
function sumBonuses(bonusArray) {
    var sum = 0;
    if (bonusArray) {
        for (var i=0; i<bonusArray.length; i++) {
            sum += bonusArray[i].value;
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
        var parts = affix.split('#');

        // add the second part as a subcomponent of the first
        if (parts.length == 2) {
            if (!bonuses[parts[0]]) {
                bonuses[parts[0]] = {};
            }
            if (!bonuses[parts[0]][parts[1]]) {
                bonuses[parts[0]][parts[1]] = [];
            }
            bonuses[parts[0]][parts[1]].push({
                from: src,
                value: attrs[affix].min
            });
        } 
        // include it as the single component of the affix
        else {
            if (!bonuses[affix]) {
                bonuses[affix] = [];
            }
            bonuses[affix].push({
                from: src,
                value: attrs[affix].min
            });
        }
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
/**
 * Determines whether a given attribute is a primary stat.
 *
 * @method isPrimaryStat
 * @param attr {String} The attribute name.
 * @param hero {Object} The hero object.
 * @return {Boolean} Whether or not the stat is primary for this class.
 */
function isPrimaryStat(attr,hero) {
    switch (attr) {
        case 'Strength':
            return hero['class'] == 'barbarian' ||
                hero['class'] == 'crusader';
        case 'Dexterity':
            return hero['class'] == 'monk' ||
                hero['class'] == 'demon-hunter';
        case 'Intelligence':
            return hero['class'] == 'wizard' ||
                hero['class'] == 'witch-doctor';
        default:
            return false;
    }
}
/*******************************************************************
 * ATTRIBUTE CALCULATORS
 *******************************************************************/
/**
 * A list of calculators for computing attributes from base and bonus stats.
 */
function calc(attr) {
    return Calculators[attr](Calculators.stats);
}
function fetchHero() {
    return Calculators.hero;
}
function fetchBase(attr) {
    // search for the appropriate section
    for (var section in Calculators.stats.base) {
        if (Calculators.stats.base[section][attr]) {
            return Calculators.stats.base[section][attr].value;
        }
    }
    return 0;
}
function fetchBonuses(attr) {
    return Calculators.stats.bonuses[attr];
}
var Calculators = {
    stats: null,
    'Level': function() {
        return Calculators.stats.hero.level;
    },
    'Strength': function() {
        var base       = fetchBase('Strength'),
            level      = calc('Level'),
            multiplier = isPrimaryStat('Strength',fetchHero()) ? 3 : 1,
            bonuses    = sumBonuses(fetchBonuses('Strength_Item'));

        return base + (level - 1) * multiplier + bonuses;
    },
    'Dexterity': function() {
        var base       = fetchBase('Dexterity'),
            level      = calc('Level'),
            multiplier = isPrimaryStat('Dexterity',fetchHero()) ? 3 : 1,
            bonuses    = sumBonuses(fetchBonuses('Dexterity_Item'));

        return base + (level - 1) * multiplier + bonuses;
    },
    'Intelligence': function() {
        var base       = fetchBase('Intelligence'),
            level      = calc('Level'),
            multiplier = isPrimaryStat('Intelligence',fetchHero()) ? 3 : 1,
            bonuses    = sumBonuses(fetchBonuses('Intelligence_Item'));

        return base + (level - 1) * multiplier + bonuses;
    },
    'Vitality': function() {
        var base    = Calculators.stats.base['Core']['Vitality'].value,
            level   = calc('Level'),
            bonuses = sumBonuses(fetchBonuses('Vitality_Item'));

        return base + (level - 1) * 2 + bonuses;
    },
    'Bonus Damage to Elites': function() {
        // TODO: compute value
        return -1;
    },
    'Attacks per Second': function() {
        // TODO: compute value
        return -1;
    },
    'Attacks per Second Off Hand': function() {
        // TODO: compute value
        return -1;
    },
    'Critical Hit Chance': function() {
        // TODO: compute value
        return -1;
    },
    'Critical Hit Damage': function() {
        // TODO: compute value
        return -1;
    },
    'Area Damage': function() {
        // TODO: compute value
        return -1;
    },
    'Cooldown Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Armor': function() {
        // TODO: compute value
        return -1;
    },
    'Block Amount': function() {
        // TODO: compute value
        return -1;
    },
    'Block Chance': function() {
        // TODO: compute value
        return -1;
    },
    'Dodge Chance': function() {
        // TODO: compute value
        return -1;
    },
    'Physical Resistance': function() {
        // TODO: compute value
        return -1;
    },
    'Cold Resistance': function() {
        // TODO: compute value
        return -1;
    },
    'Fire Resistance': function() {
        // TODO: compute value
        return -1;
    },
    'Lightning Resistance': function() {
        // TODO: compute value
        return -1;
    },
    'Poison Resistance': function() {
        // TODO: compute value
        return -1;
    },
    'Arcane/Holy Resistance': function() {
        // TODO: compute value
        return -1;
    },
    'Crowd Control Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Missile Damage Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Elite Damage Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Thorns': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Life': function() {
        // TODO: compute value
        return -1;
    },
    'Total Life Bonus': function() {
        // TODO: compute value
        return -1;
    },
    'Life per Second': function() {
        // TODO: compute value
        return -1;
    },
    'Life per Hit': function() {
        // TODO: compute value
        return -1;
    },
    'Life per Kill': function() {
        // TODO: compute value
        return -1;
    },
    'Life Steal': function() {
        // TODO: compute value
        return -1;
    },
    'Health Globe Healing Bonus': function() {
        // TODO: compute value
        return -1;
    },
    'Bonus to Gold/Globe Radius': function() {
        // TODO: compute value
        return -1;
    },
    'Movement Speed': function() {
        // TODO: compute value
        return -1;
    },
    'Gold Find': function() {
        // TODO: compute value
        return -1;
    },
    'Magic Find': function() {
        // TODO: compute value
        return -1;
    },
    'Bonus Experience': function() {
        // TODO: compute value
        return -1;
    },
    'Bonus Experience per Kill': function() {
        // TODO: compute value
        return -1;
    },
    'Life per Fury Spent': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Fury': function() {
        // TODO: compute value
        return -1;
    },
    'Fury Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Fury Cost Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Wrath': function() {
        // TODO: compute value
        return -1;
    },
    'Wrath Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Wrath Cost Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Life per Spirit Spent': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Spirit': function() {
        // TODO: compute value
        return -1;
    },
    'Spirit Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Spirit Cost Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Hatred': function() {
        // TODO: compute value
        return -1;
    },
    'Hatred Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Hatred Cost Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Discipline': function() {
        // TODO: compute value
        return -1;
    },
    'Discipline Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Discipline Cost Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Arcane Power': function() {
        // TODO: compute value
        return -1;
    },
    'Arcane Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Arcane Power Cost Reduction': function() {
        // TODO: compute value
        return -1;
    },
    'Arcane Power on Critical Hit': function() {
        // TODO: compute value
        return -1;
    },
    'Maximum Mana': function() {
        // TODO: compute value
        return -1;
    },
    'Mana Regeneration/Second': function() {
        // TODO: compute value
        return -1;
    },
    'Mana Cost Reduction': function() {
        // TODO: compute value
        return -1;
    }
};
/**
 * Computes a given attribute.
 *
 * @method computeAttribute
 * @param attr {String} The attribute name/key.
 * @param stats {String}
 */
function computeAttribute(attr,stats) {
    var calculator = Calculators[attr];
    Calculators.stats = stats;
    if (calculator) {
        var result = calculator();
        console.log(attr,result);
        return result;
    }
    return 0;
}