// priority: 0

const registerTFCItemTags = (event) => {
    // Удаление тегов у отключенных предметов
    global.TFC_DISABLED_ITEMS.forEach(item => {
        event.removeAllTagsFrom(item)
        event.add('c:hidden_from_recipe_viewers', item)
    })
}

const registerTFCBlockTags = (event) => {
    // Удаление тегов у отключенных предметов
    global.TFC_DISABLED_ITEMS.forEach(item => {
        event.removeAllTagsFrom(item)
    })
}

const registerTFCFluidTags = (event) => {

    // Добавляем тег для скрытия в EMI
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/bismuth')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/bismuth_bronze')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/bronze')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/black_bronze')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/brass')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/copper')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/gold')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/nickel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/rose_gold')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/silver')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/tin')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/zinc')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/sterling_silver')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/wrought_iron')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/black_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/red_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/blue_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/cast_iron')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/pig_iron')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/high_carbon_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/high_carbon_black_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/high_carbon_red_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/high_carbon_blue_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/weak_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/weak_red_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/weak_blue_steel')
    event.add('c:hidden_from_recipe_viewers', 'tfc:metal/unknown')
}

const registerTFCPlacedFeatures = (event) => {}