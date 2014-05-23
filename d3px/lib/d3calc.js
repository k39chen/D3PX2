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
    var order = getTemplateOrder(heroData),
        s_order = order.sectionOrder,
        a_order = order.attributeOrder;
 
    var results = {};

    for (var i=0; i<s_order.length; i++) {
        var section = s_order[i];

        if (!results[section]) {
            results[section] = {};
        }

        for (var j=0; j<a_order[section].length; j++) {

            var attr = a_order[section][j];

            results[section][attr] = computeAttribute(attr,stats);
        }
    }
    return results;
}
/*******************************************************************
 * ATTRIBUTES TEMPLATES
 *******************************************************************/
/**
 * Gets an ordering for the template.
 *
 * @method getTemplateOrder
 * @param heroData {Object} The hero data.
 * @return {Object} The template order.
 */
function getTemplateOrder(heroData) {
    var section_order = [
        'Summary',
        'Core',
        'Offense',
        'Defense',
        'Life',
        'Resource',
        'Adventure'
    ];
    var order = {
        'Summary': [
            'Damage',
            'Elemental DPS',
            'Elemental Elite DPS',
            'Toughness',
            'Healing',
        ],
        'Core': [
            'Strength',                
            'Dexterity',               
            'Intelligence',            
            'Vitality',                
        ],
        'Offense': [
            'Bonus Damage to Elites',  
            'Attacks per Second',
            'Attacks per Second Off Hand',
            'Attack Speed Increase',
            'Critical Hit Chance',     
            'Critical Hit Damage',     
            'Area Damage',             
            'Cooldown Reduction',      
        ],
        'Defense': [
            'Armor',                   
            'Block Amount',            
            'Block Chance',            
            'Dodge Chance',            
            'Physical Resistance',     
            'Cold Resistance',         
            'Fire Resistance',         
            'Lightning Resistance',    
            'Poison Resistance',       
            'Arcane/Holy Resistance',  
            'Crowd Control Reduction', 
            'Melee Damage Reduction',  
            'Missile Damage Reduction',
            'Elite Damage Reduction',  
            'Thorns',                  
        ],
        'Life': [
            'Maximum Life',            
            'Total Life Bonus',        
            'Life per Second',         
            'Life per Hit',            
            'Life per Kill',           
            'Life Steal',              
            'Health Globe Healing Bonus',
            'Bonus to Gold/Globe Radius',
        ],
        'Resource': [ /* class specific */ ],
        'Adventure': [
            'Movement Speed',          
            'Gold Find',               
            'Magic Find',              
            'Bonus Experience',        
            'Bonus Experience per Kill',
        ]
    }
    switch (heroData['class']) {
        case 'barbarian':
            order['Resource'].push(
                'Maximum Fury',                
                'Fury Regeneration/Second',    
                'Fury Cost Reduction',         
                'Fury on Critical Hit',        
                'Life per Fury Spent' 
            );
            break;
        case 'crusader':
            order['Resource'].push(
                'Maximum Wrath',               
                'Wrath Regeneration/Second',   
                'Wrath Cost Reduction',        
                'Wrath on Critical Hit',       
                'Life per Wrath Spent'
            );
            break;
        case 'monk':
            order['Resource'].push(
                'Maximum Spirit',              
                'Spirit Regeneration/Second',  
                'Spirit Cost Reduction',       
                'Spirit on Critical Hit',      
                'Life per Spirit Spent'
            );
            break;
        case 'demon-hunter':
            order['Resource'].push(
                'Maximum Hatred',              
                'Hatred Regeneration/Second',  
                'Hatred Cost Reduction',       
                'Hatred on Critical Hit',      
                'Life per Hatred Spent',       
                'Maximum Discipline',          
                'Discipline Regeneration/Second',
                'Discipline Cost Reduction',   
                'Discipline on Critical Hit',  
                'Life per Discipline Spent'
            );
            break;
        case 'wizard':
            order['Resource'].push(
                'Maximum Arcane Power',        
                'Arcane Regeneration/Second',  
                'Arcane Power Cost Reduction', 
                'Arcane Power on Critical Hit',
                'Life per Arcane Power Spent'
            );
            break;
        case 'witch-doctor':
            order['Resource'].push(
                'Maximum Mana',                
                'Mana Regeneration/Second',    
                'Mana Cost Reduction',         
                'Mana on Critical Hit',        
                'Life per Mana Power Spent'
            );
            break;
        default:
            break;
    }
    if (!isDualWielding(heroData)) {
        var index = order['Offense'].indexOf('Attacks per Second Off Hand')
        if (index > -1) {
            order['Offense'].splice(index,1)
        }
    }
    return {
        sectionOrder: section_order,
        attributeOrder: order

    };
}
/**
 * Creates a framework for the attribute template.
 *
 * @method createAttributeTemplate
 * @param heroData {Object} The hero data.
 * @return {Object} The template.
 */
function createAttributeTemplate(heroData) {
    var template = {
        'Summary': {
            'Damage':                       {value: 0, format: formatFloat()},
            'Elemental DPS':                {value: 0, format: formatFloat()},
            'Elemental Elite DPS':          {value: 0, format: formatFloat()},
            'Toughness':                    {value: 0, format: formatFloat()},
            'Healing':                      {value: 0, format: formatFloat()},
        },
        'Core': {
            'Strength':                     {value: 0, format: formatInteger()},
            'Dexterity':                    {value: 0, format: formatInteger()},
            'Intelligence':                 {value: 0, format: formatInteger()},
            'Vitality':                     {value: 0, format: formatInteger()}
        },
        'Offense': {
            'Bonus Damage to Elites':       {value: 0, format: formatPercentage()},
            'Attacks per Second':           {value: 0, format: formatFloat()},
            'Attack Speed Increase':        {value: 0, format: formatPercentage()},
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
                'Maximum Wrath':                    {value: 0, format: formatInteger()},
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
    if (isDualWielding(heroData)) {
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
 * @param hero {Object} The hero object.
 * @return {Boolean} Flag indicating whether or not the hero is dual wielding.
 */
function isDualWielding(hero) {
    if (hero.items['mainHand'] && hero.items['offHand']) {
        if (hero.items['mainHand'].dps != null && hero.items['offHand'].dps != null) {
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
        case 'Strength':     return hero['class'] == 'barbarian' || hero['class'] == 'crusader';
        case 'Dexterity':    return hero['class'] == 'monk'      || hero['class'] == 'demon-hunter';
        case 'Intelligence': return hero['class'] == 'wizard'    || hero['class'] == 'witch-doctor';
        default:             return false;
    }
}
/**
 * Gets the primary stat of the hero
 *
 * @method getPrimaryStat
 * @param hero {Object} The hero object.
 * @return {String} The name of the primary stat for this hero.
 */
function getPrimaryStat(hero) {
    switch (hero['class']) {
        default:
        case 'barbarian':
        case 'crusader':
            return 'Strength';
        case 'monk':
        case 'demon-hunter':
            return 'Dexterity';
        case 'wizard':
        case 'witch-doctor':
            return 'Intelligence';
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
// SUMMARY
//===========================================================================================
    '{Weapon} Diagnostics': function(stats,options) {
        if (!options || !options.weapon || !options.weapon.dps) return {min: 0, max: 0, delta: 0, aps: 0};

        var min = 0,
            max = 0,
            delta = 0,
            aps_pct = 0,
            aps = 0,
            dmg_pct = 0.0,
            ruby = 0;

        // apply base weapon damage ranges
        var bonuses  = options.weapon.attributesRaw._data;
        for (var attr in bonuses) {
            var bonus = bonuses[attr].min;

            if (attr.indexOf('Damage_Weapon') > -1) {
                if (attr.indexOf('Min') > -1) {
                    min += bonus;
                } else if (attr.indexOf('Delta') > -1) {
                    delta += bonus;
                } else if (attr.indexOf('Percent_Bonus') > -1) {
                    dmg_pct += bonus;
                }
            } else if (attr == 'Attacks_Per_Second_Item') {
                aps = bonus;
            } else if (attr == 'Attacks_Per_Second_Item_Percent') {
                aps_pct += bonus;
            }
        }
        // see if this weapon has a ruby in its socket
        var gems = options.weapon.gems;
        for (var i=0; i<gems.length; i++) {
            var gem_bonuses = gems[i].attributesRaw._data;
            for (var attr in gem_bonuses) {
                var bonus = gem_bonuses[attr];
                if (attr.indexOf('Damage_Weapon_Bonus_Flat') > -1) {
                    ruby += bonus.min; 
                }
            }
        }
        // apply socket bonus
        min += ruby;
        max = min + delta;

        // apply enhanced damage
        min *= (1 + dmg_pct);
        max *= (1 + dmg_pct);
        aps *= (1 + aps_pct);

        return {min: min, max: max, aps: aps};
    },
    'Average Damage {Element}': function(stats, options) {
        var min_bonuses = sumBonuses(fetchBonuses('Damage_Min#'+options.element)),
            delta_bonuses = sumBonuses(fetchBonuses('Damage_Delta#'+options.element));

        return {min:min_bonuses, max:min_bonuses+delta_bonuses};
    },
    'Damage': function() {

        var mh = calc('{Weapon} Diagnostics', {weapon:fetchHero().items.mainHand}),
            oh = calc('{Weapon} Diagnostics', {weapon:fetchHero().items.offHand}),
            ad = calc('Average Damage {Element}', {element:'Physical'}),
            pstat = calc(getPrimaryStat(fetchHero())),
            aps_bonus = calc('Attack Speed Increase'),
            dual_aps = (2 * mh.aps * oh.aps) / (mh.aps + oh.aps),
            crit_chance = calc('Critical Hit Chance'),
            crit_damage = calc('Critical Hit Damage'),
            passive_damage = 0; // eg. 8% increased damage

        // apply average damage on jewellery and offhands and apply to weapon ranges
        mh.min += ad.min;
        mh.max += ad.max;
        if (oh.aps) {
            oh.min += ad.min;
            oh.max += ad.max;
        }

        var dps = (1 + pstat / 100) *                                // primary stat modifer
            (1 + crit_chance * crit_damage) *                        // critical damage modifier
            (1 + aps_bonus) *                                        // attack speed modifier [1]
            (oh.aps ? dual_aps : mh.aps) *                           // attack speed modifier [2] 
            (mh.min + mh.max + oh.min + oh.max) / (oh.aps ? 4 : 2) * // average damage modifier
            (1 + passive_damage);                                    // passive damage modifier

        return dps;
    },
    'Elemental DPS': function() {
        var dps = calc('Damage'),
            bonuses = fetchBonuses('Damage_Dealt_Percent_Bonus'),
            elements = {},
            max_element = '';

        // collect elemental bonuses
        for (var element in bonuses) {
            for (var i=0; i<bonuses[element].length; i++) {
                var bonus = bonuses[element][i].value;
            
                if (!elements[element]) {
                    elements[element] = 0;
                }
                elements[element] += bonus;
            }
        }
        // look for largest elemental bonus
        var largest = -1;
        for (var element in elements) {
            if (elements[element] > largest) {
                largest = elements[element];
                max_element = element;
            }
        }
        return dps * (1 + largest);
    },
    'Elemental Elite DPS': function() {
        var dps = calc('Elemental DPS'),
            elite_damage = calc('Bonus Damage to Elites');

        return dps * (1 + elite_damage);
    },
    'Toughness': function() {
        var mlvl = calc('Level'),
            hclass = fetchHero()['class'],
            hp = calc('Maximum Life'),
            dodge_reduction = calc('Dodge Chance'),
            armor = calc('Armor'),
            armor_reduction = armor / (armor + mlvl * 50),
            total_resist = 
                calc('Physical Resistance') + 
                calc('Cold Resistance') +
                calc('Fire Resistance') +
                calc('Lightning Resistance') +
                calc('Poison Resistance') +
                calc('Arcane/Holy Resistance'),
            avg_resist = total_resist / 6,
            resist_reduction = avg_resist / (avg_resist + mlvl * 5),
            class_reduction = (hclass == 'barbarian' || hclass == 'crusader') ? 0.30 : 0;
            //block_reduction = calc('Block Chance'),
            //cc_reduction = calc('Crowd Control Reduction'),
            //melee_reduction = calc('Melee Damage Reduction'),
            //missile_reduction = calc('Missile Damage Reduction'),
            //elite_reduction = calc('Elite Damage Reduction');

        var reduction = 
            (1 - dodge_reduction) *
            (1 - armor_reduction) *
            (1 - resist_reduction) *
            (1 - class_reduction);
            //(1 - block_reduction) *
            //(1 - cc_reduction) *
            //(1 - melee_reduction) *
            //(1 - missile_reduction) *
            //(1 - elite_reduction);

        return hp / reduction;
    },
    'Healing': function() {
        var loh = calc('Life per Hit'),
            mh_aps = calc('Attacks per Second'),
            oh_aps = calc('Attacks per Second Off Hand'),
            lps = calc('Life per Second'),
            ls = calc('Life Steal'),
            damage = calc('Damage'),
            lpk = calc('Life per Kill');

        return lps +                  // life per second
            loh * (mh_aps / oh_aps) + // life on hit
            damage * ls * 0.1 +       // life steal
            lpk * 0.16;               // life per kill
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
    'Bonus Damage to Elites': function() {
        var bonuses = sumBonuses(fetchBonuses('Damage_Percent_Bonus_Vs_Elites'));
        return bonuses;
    },
    'Attacks per Second {Weapon}': function(stats,options) {
        if (!options || !options.weapon || !options.weapon.dps) return 1.0;

        var pct_bonus = calc('Attack Speed Increase'),
            wep_pct_bonus = options.weapon.attributesRaw['Attacks_Per_Second_Item_Percent'],
            wep_bonus = options.weapon.attributesRaw['Attacks_Per_Second_Item_Bonus'],
            aps_bonus = sumBonuses(fetchBonuses('Attacks_Per_Second_Bonus')),
            wep_aps = options.weapon.attributesRaw['Attacks_Per_Second_Item'].min;

        wep_pct_bonus = wep_pct_bonus ? wep_pct_bonus.min : 0;
        wep_bonus = wep_bonus ? wep_bonus : 0;
        aps_bonus = aps_bonus ? aps_bonus : 0;

        return ((wep_aps + wep_bonus) * (1 + wep_pct_bonus) + aps_bonus) * (1 + pct_bonus);
    },
    'Attacks per Second': function() {
        var aps = calc('Attacks per Second {Weapon}',{weapon:fetchHero().items.mainHand});
        return aps;
    },
    'Attacks per Second Off Hand': function() {
        var aps = calc('Attacks per Second {Weapon}',{weapon:fetchHero().items.offHand});
        return aps;
    },
    'Attack Speed Increase': function() {
        var bonuses = sumBonuses(fetchBonuses('Attacks_Per_Second_Percent')),
            dw_bonus = isDualWielding(fetchHero()) ? 0.15 : 0;
        return bonuses + dw_bonus;
    },
    'Critical Hit Chance': function() {
        var base = fetchBase('Critical Hit Chance'),
            bonuses = sumBonuses(fetchBonuses('Crit_Percent_Bonus_Capped'));

        return base + bonuses;
    },
    'Critical Hit Damage': function() {
        var base = fetchBase('Critical Hit Damage'),
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
        var block_min = sumBonuses(fetchBonuses('Block_Amount_Item_Min')),
            block_delta = sumBonuses(fetchBonuses('Block_Amount_Item_Delta'));

        return block_min + block_delta / 2;
    },
    'Block Chance': function() {
        var bonuses = sumBonuses(fetchBonuses('Block_Chance_Item'));
        return bonuses;
    },
    'Dodge Chance': function() {
        var dexterity = calc('Dexterity'),
            mlvl = calc('Level'),
            dodge_chance = (mlvl == 70)
                ? dexterity * 0.00461
                : dexterity / (0.00031 * Math.pow(mlvl,3) + 0.0186 * Math.pow(mlvl,2) + 0.25 * mlvl + 1.93);
        return dodge_chance / 100;
    },
    'Damage Reduced From {Element} Resistance': function(stats,options) {
        var mlvl = calc('Level'),
            resist = options.element == 'All' 
            ? calc('All Resistance')
            : calc('{Element} Resistance',{element:options.element});

        return resist / (resist + mlvl * 5);
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
            life_per_vitality = 10,
            life_percent = calc('Total Life Bonus');

        if (level <= 34) {
            life_per_vitality = 10;
        } else if (level >= 35 && level <= 60) {
            life_per_vitality = level - 25;
        } else if (level >= 61 && level <= 65) {
            life_per_vitality = 35 + (level - 60) * 4;
        } else if (level >= 66 && level <= 70) {
            life_per_vitality = 55 + (level - 65) * 5;
        }

        return ((36 + 4 * level) + life_per_vitality * vitality) * (1 + life_percent);
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
        return result;
    }
    return 0;
}