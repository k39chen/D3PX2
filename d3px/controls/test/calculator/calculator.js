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


                // GoodIdea-1513

                var battleTag = 'GoodIdea-1513';
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
            'Damage Increased by Skills':   {value: 0, format: formatPercentage()},
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
            'Melee Damage Reduction':       {value: 0, format: formatPercentage()},
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
            template['Resource'] = {
                'Maximum Fury':                     {value: 0, format: formatInteger()},
                'Fury Regeneration/Second':         {value: 0, format: formatFloat()},
                'Fury Cost Reduction':              {value: 0, format: formatPercentage(0)},
                'Fury on Critical Hit':             {value: 0, format: formatInteger()},
                'Life per Fury Spent':              {value: 0, format: formatFloat()}
            };
            break;
        case 'crusader':
            template['Resource'] = {
                'Maximum Wrath':                    {value: 0, format: formatIntger()},
                'Wrath Regeneration/Second':        {value: 0, format: formatFloat()},
                'Wrath Cost Reduction':             {value: 0, format: formatPercentage(0)},
                'Wrath on Critical Hit':            {value: 0, format: formatInteger()},
                'Life per Wrath Spent':             {value: 0, format: formatFloat()}
            };
            break;
        case 'monk':
            template['Resource'] = {
                'Maximum Spirit':                   {value: 0, format: formatInteger()},
                'Spirit Regeneration/Second':       {value: 0, format: formatFloat()},
                'Spirit Cost Reduction':            {value: 0, format: formatPercentage(0)},
                'Spirit on Critical Hit':           {value: 0, format: formatInteger()},
                'Life per Spirit Spent':            {value: 0, format: formatFloat()}
            };
            break;
        case 'demon-hunter':
            template['Resource'] = {
                'Maximum Hatred':                   {value: 0, format: formatInteger()},
                'Hatred Regeneration/Second':       {value: 0, format: formatFloat()},
                'Hatred Cost Reduction':            {value: 0, format: formatPercentage(0)},
                'Hatred on Critical Hit':           {value: 0, format: formatInteger()},
                'Life per Hatred Spent':            {value: 0, format: formatFloat()},
                'Maximum Discipline':               {value: 0, format: formatInteger()},
                'Discipline Regeneration/Second':   {value: 0, format: formatInteger()},
                'Discipline Cost Reduction':        {value: 0, format: formatPercentage(0)},
                'Discipline on Critical Hit':       {value: 0, format: formatInteger()},
                'Life per Discipline Spent':        {value: 0, format: formatFloat()}
            };
            break;
        case 'wizard':
            template['Resource'] = {
                'Maximum Arcane Power':             {value: 0, format: formatInteger()},
                'Arcane Regeneration/Second':       {value: 0, format: formatFloat()},
                'Arcane Power Cost Reduction':      {value: 0, format: formatPercentage(0)},
                'Arcane Power on Critical Hit':     {value: 0, format: formatInteger()},
                'Life per Arcane Power Spent':      {value: 0, format: formatFloat()}
            };
            break;
        case 'witch-doctor':
            template['Resource'] = {
                'Maximum Mana':                     {value: 0, format: formatInteger()},
                'Mana Regeneration/Second':         {value: 0, format: formatFloat()},
                'Mana Cost Reduction':              {value: 0, format: formatPercentage(0)},
                'Mana on Critical Hit':             {value: 0, format: formatInteger()},
                'Life per Mana Power Spent':        {value: 0, format: formatFloat()}
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


    console.log(stats)

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
 * Mulitplies all the bonus values together.
 *
 * @method multiplyBonuses
 * @param bonusArray {Array} The array of bonuses.
 * @return {Number} The value of the product.
 */
function multiplyBonuses(bonusArray) {
    var product = 1;
    if (bonusArray) {
        for (var i=0; i<bonusArray.length; i++) {
            product *= bonusArray[i].value;
        }
    }
    return product;
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
            var p1 = parts[0], p2 = parts[1];

            if (!bonuses[p1]) {
                bonuses[p1] = {};
            }
            if (!bonuses[p1][p2]) {
                bonuses[p1][p2] = [];
            }
            bonuses[p1][p2].push({
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
function calc(attr,options) {
    return Calculators[attr](Calculators.stats,options);
}
function fetchHero() {
    return Calculators.stats.hero;
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
    var parts = attr.split('#');
    if (parts.length == 2) {
        var p1 = parts[0], p2 = parts[1];

        return Calculators.stats.bonuses[p1]
            ? Calculators.stats.bonuses[p1][p2]
            : 0;
    }
    return Calculators.stats.bonuses[attr];
}
var Calculators = {
    stats: null,
    'Level': function() {
        return Calculators.stats.hero.level;
    },
//===========================================================================================
// CORE
//===========================================================================================
    'Strength': function() {
        var base = fetchBase('Strength'),
            level = calc('Level'),
            multiplier = isPrimaryStat('Strength',fetchHero()) ? 3 : 1,
            bonuses = sumBonuses(fetchBonuses('Strength_Item'));

        return base + (level - 1) * multiplier + bonuses;
    },
    'Dexterity': function() {
        var base = fetchBase('Dexterity'),
            level = calc('Level'),
            multiplier = isPrimaryStat('Dexterity',fetchHero()) ? 3 : 1,
            bonuses = sumBonuses(fetchBonuses('Dexterity_Item'));

        return base + (level - 1) * multiplier + bonuses;
    },
    'Intelligence': function() {
        var base = fetchBase('Intelligence'),
            level = calc('Level'),
            multiplier = isPrimaryStat('Intelligence',fetchHero()) ? 3 : 1,
            bonuses = sumBonuses(fetchBonuses('Intelligence_Item'));

        return base + (level - 1) * multiplier + bonuses;
    },
    'Vitality': function() {
        var base = Calculators.stats.base['Core']['Vitality'].value,
            level = calc('Level'),
            bonuses = sumBonuses(fetchBonuses('Vitality_Item'));

        return base + (level - 1) * 2 + bonuses;
    },
//===========================================================================================
// OFFENSE
//===========================================================================================
    'Damage Increased by Skills': function() {
        //var bonuses = sumBonuses(fetchBonuses('Power_Damage_Percent_Bonus'));  
        return -1;
    },
    'Bonus Damage to Elites': function() {
        var bonuses = sumBonuses(fetchBonuses('Damage_Percent_Bonus_Vs_Elites'));
        return bonuses;
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
        var base = fetchBase('Critical Hit Chance'),
            bonuses = sumBonuses(fetchBonuses('Crit_Percent_Bonus_Capped'));

        return base + bonuses;
    },
    'Critical Hit Damage': function() {
        var base = fetchBase('Critical Hit Chance'),
            bonuses = sumBonuses(fetchBonuses('Crit_Damage_Percent'));

        return base + bonuses;
    },
    'Area Damage': function() {
        var bonuses = sumBonuses(fetchBonuses('Splash_Damage_Effect_Percent'));
        return bonuses;
    },
    'Cooldown Reduction': function() {
        var bonuses = sumBonuses(fetchBonuses('Power_Cooldown_Reduction_Percent_All'));
        return bonuses;
    },
//===========================================================================================
// DEFENSE
//===========================================================================================
    'Armor': function() {
        var strength = calc('Strength'),
            armor_bonuses = 
                sumBonuses(fetchBonuses('Armor_Item')) +
                sumBonuses(fetchBonuses('Armor_Bonus_Item'));

        return strength + armor_bonuses;
    },
    'Block Amount': function() {
        // TODO: compute value
        return -1;
    },
    'Block Chance': function() {
        var bonuses = sumBonuses(fetchBonuses('Block_Chance_Item'));
        return bonuses;
    },
    'Dodge Chance': function() {
        var dexterity = calc('Dexterity'),
            dodge_chance = 0.0;

        if (dexterity > 1000) {
            dodge_chance = (dexterity - 1000) * 0.0001 + 0.3;
        } else if (dexterity > 500) {
            dodge_chance = (dexterity - 500) * 0.0002 + 0.2;
        } else if (dexterity > 100) {
            dodge_chance = (dexterity - 100) * 0.00025 + 0.1;
        } else {
            dodge_chance = dexterity * 0.001;
        }
        return dodge_chance;
    },
    'All Resistance': function() {
        var all_resist = sumBonuses(fetchBonuses('Resistance_All'));
        return all_resist;
    },
    '{Element} Resistance': function(stats,options) {
        var intelligence = calc('Intelligence'),
            all_resist = calc('All Resistance'),
            bonuses = sumBonuses(fetchBonuses('Resistance#'+options.element));

        return intelligence / 10 + all_resist + bonuses;
    },
    'Physical Resistance': function() {
        return calc('{Element} Resistance',{element: 'Physical'});
    },
    'Cold Resistance': function() {
        return calc('{Element} Resistance',{element: 'Cold'});
    },
    'Fire Resistance': function() {
        return calc('{Element} Resistance',{element: 'Fire'});
    },
    'Lightning Resistance': function() {
        return calc('{Element} Resistance',{element: 'Lightning'});
    },
    'Poison Resistance': function() {
        return calc('{Element} Resistance',{element: 'Poison'});
    },
    'Arcane/Holy Resistance': function() {
        return calc('{Element} Resistance',{element: 'Arcane'});
    },
    '{Damage} Reduction': function(stats,options) {
        var sum_bonuses = multiplyBonuses(fetchBonuses(options.key)),
            multiply_bonuses = multiplyBonuses(fetchBonuses(options.key));

        return sum_bonuses - multiply_bonuses;
    },
    'Crowd Control Reduction': function() {
        return calc('{Damage} Reduction',{key: 'CrowdControl_Reduction'});
    },
    'Melee Damage Reduction': function() {
        return calc('{Damage} Reduction',{key: 'Damage_Percent_Reduction_From_Melee'});
    },
    'Missile Damage Reduction': function() {
        return calc('{Damage} Reduction',{key: 'Damage_Percent_Reduction_From_Ranged'});
    },
    'Elite Damage Reduction': function() {
        return calc('{Damage} Reduction',{key: 'Damage_Percent_Reduction_From_Elites'});
    },
    'Thorns': function() {
        var bonuses = sumBonuses(fetchBonuses('Thorns_Fixed#Physical'));
        return bonuses;
    },
//===========================================================================================
// LIFE
//===========================================================================================
    'Maximum Life': function() {
        var level = calc('Level'),
            vitality = calc('Vitality'),
            life_per_vitality = Math.max(level - 25,10),
            life_percent = calc('Total Life Bonus');

        return (36 + 4 * level + vitality * life_per_vitality) * (1 + life_percent);
    },
    'Total Life Bonus': function() {
        var bonuses = sumBonuses(fetchBonuses('Hitpoints_Max_Percent_Bonus_Item'));
        return bonuses;
    },
    'Life per {Unit}': function(stats,options) {
        var bonuses = sumBonuses(fetchBonuses(options.key));
        return bonuses;
    },
    'Life per Second': function() {
        return calc('Life per {Unit}',{key: 'Hitpoints_Regen_Per_Second'});
    },
    'Life per Hit': function() {
        return calc('Life per {Unit}',{key: 'Hitpoints_On_Hit'});
    },
    'Life per Kill': function() {
        return calc('Life per {Unit}',{key: 'Hitpoints_On_Kill'});
    },
    'Life Steal': function() {
        return calc('Life per {Unit}',{key: 'Steal_Health_Percent'});
    },
    'Health Globe Healing Bonus': function() {
        var bonuses = sumBonuses(fetchBonuses('Health_Globe_Bonus_Health'));
        return bonuses;
    },
    'Bonus to Gold/Globe Radius': function() {
        var bonuses = sumBonuses(fetchBonuses('Gold_PickUp_Radius'));
        return bonuses;
    },
//===========================================================================================
// ADVENTURE
//===========================================================================================
    'Movement Speed': function() {
        var bonuses = sumBonuses(fetchBonuses('Movement_Scalar'));
        return bonuses;
    },
    'Gold Find': function() {
        var bonuses = sumBonuses(fetchBonuses('Gold_Find'));
        return bonuses;
    },
    'Magic Find': function() {
        var bonuses = sumBonuses(fetchBonuses('Magic_Find'));
        return bonuses;
    },
    'Bonus Experience': function() {
        var bonuses = sumBonuses(fetchBonuses('Experience_Bonus_Percent'));
        return bonuses;
    },
    'Bonus Experience per Kill': function() {
        var bonuses = sumBonuses(fetchBonuses('Experience_Bonus'));
        return bonuses;
    },
//===========================================================================================
// RESOURCE
//===========================================================================================
    'Life per {Resource} Spent': function(stats,options) {
        var bonuses = sumBonuses(fetchBonuses('Spending_Resource_Heals_Percent#'+options.resource));
        return bonuses;
    },
    'Maximum {Resource}': function(stats,options) {
        var base = fetchBase('Maximum '+options['name']),
            bonuses = sumBonuses(fetchBonuses('Resource_Max_Bonus#'+options.resource));

        return base + bonuses;
    },
    '{Resource} Regeneration/Second': function(stats,options) {
        var base = fetchBase(options['name']+' Regeneration/Second'),
            bonuses = sumBonuses(fetchBonuses('Resource_Regen_Per_Second#'+options.resource));

        return base + bonuses;
    },
    '{Resource} Cost Reduction': function(stats,options) {
        var bonuses = sumBonuses(fetchBonuses('Resource_Cost_Reduction_Percent_All'));
        return bonuses;
    },
    '{Resource} on Critical Hit': function(stats,options) {
        var bonuses = sumBonuses(fetchBonuses('Resource_On_Crit#'+options.resource));
        return bonuses;
    },
    //---------------------------------------------------------------------------------------
    // BARBARIAN
    //---------------------------------------------------------------------------------------
    'Life per Fury Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Fury'});
    },
    'Maximum Fury': function() {
        return calc('Maximum {Resource}',{name: 'Fury', resource: 'Fury'});
    },
    'Fury Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Fury', resource: 'Fury'});
    },
    'Fury Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Fury'});
    },
    'Fury on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Fury'});
    },
    //---------------------------------------------------------------------------------------
    // CRUSADER
    //---------------------------------------------------------------------------------------
    'Life per Wrath Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Faith'});
    },
    'Maximum Wrath': function() {
        return calc('Maximum {Resource}',{name: 'Wrath', resource: 'Faith'});
    },
    'Wrath Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Wrath', resource: 'Faith'});
    },
    'Wrath Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Faith'});
    },
    'Wrath on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Faith'});
    },
    //---------------------------------------------------------------------------------------
    // MONK
    //---------------------------------------------------------------------------------------
    'Life per Spirit Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Spirit'});
    },
    'Maximum Spirit': function() {
        return calc('Maximum {Resource}',{name: 'Spirit', resource: 'Spirit'});
    },
    'Spirit Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Spirit', resource: 'Spirit'});
    },
    'Spirit Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Spirit'});
    },
    'Spirit on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Spirit'});
    },
    //---------------------------------------------------------------------------------------
    // DEMON HUNTER
    //---------------------------------------------------------------------------------------
    'Life per Hatred Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Hatred'});
    },
    'Maximum Hatred': function() {
        return calc('Maximum {Resource}',{name: 'Hatred', resource: 'Hatred'});
    },
    'Hatred Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Hatred', resource: 'Hatred'});
    },
    'Hatred Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Hatred'});
    },
    'Hatred on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Hatred'});
    },
    //--------------------------------------------------------------------------------------
    'Life per Discipline Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Discipline'});
    },
    'Maximum Discipline': function() {
        return calc('Maximum {Resource}',{name: 'Discipline', resource: 'Discipline'});
    },
    'Discipline Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Discipline', resource: 'Discipline'});
    },
    'Discipline Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Discipline'});
    },
    'Discipline on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Discipline'});
    },
    //---------------------------------------------------------------------------------------
    // WIZARD
    //---------------------------------------------------------------------------------------
    'Life per Arcane Power Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Arcanum'});
    },
    'Maximum Arcane Power': function() {
        return calc('Maximum {Resource}',{name: 'Arcane Power', resource: 'Arcanum'});
    },
    'Arcane Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Arcane', resource: 'Arcanum'});
    },
    'Arcane Power Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Arcanum'});
    },
    'Arcane Power on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Arcanum'});
    },
    //---------------------------------------------------------------------------------------
    // WITCH DOCTOR
    //---------------------------------------------------------------------------------------
    'Life per Mana Power Spent': function() {
        return calc('Life per {Resource} Spent',{resource: 'Mana'});
    },
    'Maximum Mana': function() {
        return calc('Maximum {Resource}',{name: 'Mana', resource: 'Mana'});
    },
    'Mana Regeneration/Second': function() {
        return calc('{Resource} Regeneration/Second',{name: 'Mana', resource: 'Mana'});
    },
    'Mana Cost Reduction': function() {
        return calc('{Resource} Cost Reduction',{resource: 'Mana'});
    },
    'Mana on Critical Hit': function() {
        return calc('{Resource} on Critical Hit',{resource: 'Mana'});
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