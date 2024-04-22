// priority: 0

const registerTFCRecipes = (event) => {
 
    //#region Земля

    // Loam + Silt -> Silty Loam (Миксер)
    event.recipes.gtceu.mixer('silty_loam_dirt')             
        .itemInputs('tfc:dirt/loam', 'tfc:dirt/silt')
        .itemOutputs('tfc:dirt/silty_loam')
        .duration(1600)
        .EUt(12)

    // Silty Loam + Sticks -> Rooted Silty Loam (Миксер)
    event.recipes.gtceu.mixer('rooted_silty_loam_dirt')             
        .itemInputs('tfc:dirt/silty_loam', '#tfc:can_be_lit_on_torch')
        .itemOutputs('tfc:rooted_dirt/silty_loam')
        .duration(1600)
        .EUt(12)

    // Loam + Sand -> Sandy Loam (Миксер)
    event.recipes.gtceu.mixer('sandy_loam_dirt')             
        .itemInputs('tfc:dirt/loam', '#forge:sand')
        .itemOutputs('tfc:dirt/sandy_loam')
        .duration(1600)
        .EUt(12)

    // Loam + Silt -> Silty Loam (Create Миксер)
    event.recipes.gtceu.create_mixer('silty_loam_dirt')             
        .itemInputs('tfc:dirt/loam', 'tfc:dirt/silt')
        .itemOutputs('tfc:dirt/silty_loam')
        .duration(1600)
        .EUt(12)
        .rpm(60)

    // Silty Loam + Sticks -> Rooted Silty Loam (Create Миксер)
    event.recipes.gtceu.create_mixer('rooted_silty_loam_dirt')             
        .itemInputs('tfc:dirt/silty_loam', '#tfc:can_be_lit_on_torch')
        .itemOutputs('tfc:rooted_dirt/silty_loam')
        .duration(1600)
        .EUt(12)
        .rpm(60)

    // Loam + Sand -> Sandy Loam (Create Миксер)
    event.recipes.gtceu.create_mixer('sandy_loam_dirt')             
        .itemInputs('tfc:dirt/loam', '#forge:sand')
        .itemOutputs('tfc:dirt/sandy_loam')
        .duration(1600)
        .EUt(12)
        .rpm(60)

    global.TFC_MUD_TYPES.forEach(mud => {
        event.smelting(`tfc:dirt/${mud}`, `tfc:mud/${mud}`)
            .id(`tfg:smelting/${mud}_mud_to_grass`)
    })

    //#endregion

    //#region Грязь

    global.TFC_MUD_TYPES.forEach(mud => {
        // Dirt -> Mud
        event.recipes.gtceu.mixer(`${mud}_grass_to_mud`)             
            .itemInputs(`tfc:dirt/${mud}`)
            .inputFluids(Fluid.of('minecraft:water', 100))
            .itemOutputs(`tfc:mud/${mud}`)
            .duration(200)
            .EUt(16)
    })

    //#endregion

    //#region Грязь кирпичи
    
    global.TFC_MUD_TYPES.forEach(mud => {
        
        // Влажный кирпич -> Кирпич
        event.smelting(`tfc:mud_brick/${mud}`, `tfc:drying_bricks/${mud}`)
            .id(`tfg:smelting/${mud}_drying_brick_to_brick`)

        event.custom({
            type: "firmalife:drying",
            ingredient: {
                item: `tfc:drying_bricks/${mud}`
            },
            result: {
                item: `tfc:mud_brick/${mud}`
            }
        }).id(`tfg:drying/${mud}_drying_brick_to_brick`)

        // Кирпич -> Блок кирпичей
        event.shaped(`tfc:mud_bricks/${mud}`, [
            'ABA',
            'BAB',
            'ABA'  
        ], {
            A: `tfc:mud_brick/${mud}`,
            B: '#tfc:mortar'
        }).id(`tfc:crafting/soil/${mud}_mud_bricks`)

        event.recipes.gtceu.assembler(`mud_bricks_${mud}`)             
            .itemInputs(`5x tfc:mud_brick/${mud}`)
            .inputFluids(Fluid.of('gtceu:concrete', 72))
            .itemOutputs(`4x tfc:mud_bricks/${mud}`)
            .duration(50)
            .EUt(2)

        // Блок кирпичей -> Ступени
        event.remove({ id: `tfc:crafting/soil/${mud}_mud_bricks_stairs` })

        event.stonecutting(`tfc:mud_bricks/${mud}_stairs`, `tfc:mud_bricks/${mud}`)
            .id(`tfc:stonecutting/soil/${mud}_mud_bricks_stairs`)

        generateCutterRecipe(event, `tfc:mud_bricks/${mud}`, 0, `tfc:mud_bricks/${mud}_stairs`, 100, 8, `${mud}_mud_bricks_to_stairs`)

        // Блок кирпичей -> Плиты
        event.remove({ id: `tfc:crafting/soil/${mud}_mud_bricks_slab` })

        event.stonecutting(`2x tfc:mud_bricks/${mud}_slab`, `tfc:mud_bricks/${mud}`)
            .id(`tfc:stonecutting/soil/${mud}_mud_bricks_slab`)

        generateCutterRecipe(event, `tfc:mud_bricks/${mud}`, 1, `2x tfc:mud_bricks/${mud}_slab`, 100, 8, `${mud}_mud_bricks_to_slab`)

        // Блок кирпичей -> Стена
        event.remove({ id: `tfc:crafting/soil/${mud}_mud_bricks_wall` })

        event.stonecutting(`tfc:mud_bricks/${mud}_wall`, `tfc:mud_bricks/${mud}`)
            .id(`tfc:stonecutting/soil/${mud}_mud_bricks_wall`)

        generateCutterRecipe(event, `tfc:mud_bricks/${mud}`, 2, `tfc:mud_bricks/${mud}_wall`, 100, 8, `${mud}_mud_bricks_to_wall`)
        
    })

    //#endregion

    //#region Камень

    global.TFC_STONE_TYPES.forEach(stone => {
    
        let stoneMaterial = GTMaterials.get(stone);
        let stoneDust = ChemicalHelper.get(TagPrefix.dust, stoneMaterial, 1)

        // Кирпич (предмет)
        event.recipes.gtceu.assembler(`tfg:tfc/${stone}_loose_to_brick`)             
            .itemInputs(`tfc:rock/loose/${stone}`)
            .itemOutputs(`tfc:brick/${stone}`)
            .duration(40)
            .EUt(8)

        //#region Сырой камень

        // Сырой камень -> Сырой камень
        event.recipes.gtceu.rock_breaker(`${stone}_raw`)             
            .notConsumable(`tfc:rock/raw/${stone}`)
            .itemOutputs(`tfc:rock/raw/${stone}`)
            .duration(16)
            .EUt(7)

        // Сырой камень -> Булыжник
        event.recipes.gtceu.forge_hammer(`${stone}_raw_to_cobble`)             
            .itemInputs(`tfc:rock/raw/${stone}`)
            .itemOutputs(`tfc:rock/cobble/${stone}`)
            .duration(10)
            .EUt(16)

        // Сырой камень -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_raw_stairs` })

        generateCutterRecipe(event, `tfc:rock/raw/${stone}`, 0, [`tfc:rock/raw/${stone}_stairs`, stoneDust], 100, 8, `${stone}_raw_to_stairs`)

        // Сырой камень -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_raw_slab` })

        generateCutterRecipe(event, `tfc:rock/raw/${stone}`, 1, [`2x tfc:rock/raw/${stone}_slab`, stoneDust], 100, 8, `${stone}_raw_to_slab`)

        // Сырой камень -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_raw_wall` })

        generateCutterRecipe(event, `tfc:rock/raw/${stone}`, 2, [`tfc:rock/raw/${stone}_wall`, stoneDust], 100, 8, `${stone}_raw_to_wall`)

        // ? -> Сырая нажимная пластина
        event.shaped(`tfc:rock/pressure_plate/${stone}`, [
            'ABA',
            'CDC',
            'AEA'  
        ], {
            A: '#forge:screws/wrought_iron',
            B: '#tfc:hammers',
            C: `tfc:rock/raw/${stone}_slab`,
            D: '#forge:springs',
            E: '#forge:tools/screwdrivers'
        }).id(`tfc:crafting/rock/${stone}_pressure_plate`)

        event.recipes.gtceu.assembler(`${stone}_raw_pressure_plate`)             
            .itemInputs('#forge:springs', `2x tfc:rock/raw/${stone}_slab`)
            .circuit(0)
            .itemOutputs(`2x tfc:rock/pressure_plate/${stone}`)
            .duration(50)
            .EUt(2)

        // ? -> Сырая кнопка
        event.remove({ id: `tfc:crafting/rock/${stone}_button` })

        generateCutterRecipe(event, `tfc:rock/pressure_plate/${stone}`, 0, `6x tfc:rock/button/${stone}`, 50, 2, `${stone}_raw_button`)

        //#endregion

        //#region Булыжник

        // Булыжник -> Булыжник
        event.recipes.gtceu.rock_breaker(`${stone}_cobble`)             
            .notConsumable(`tfc:rock/cobble/${stone}`)
            .itemOutputs(`tfc:rock/cobble/${stone}`)
            .duration(16)
            .EUt(7)

        // Булыжник -> Гравий
        event.recipes.gtceu.forge_hammer(`${stone}_cobble_to_gravel`)             
            .itemInputs(`tfc:rock/cobble/${stone}`)
            .itemOutputs(`tfc:rock/gravel/${stone}`)
            .duration(10)
            .EUt(16)

        // Камни -> Булыжник
        event.shaped(`tfc:rock/cobble/${stone}`, [
            'ABA',
            'BAB',
            'ABA'  
        ], {
            A: `tfc:rock/loose/${stone}`,
            B: '#tfc:mortar'
        }).id(`tfc:crafting/rock/${stone}_loose_rocks_to_cobble`)

        event.recipes.gtceu.assembler(`${stone}_loose_rocks_to_cobble`)             
            .itemInputs(`4x tfc:rock/loose/${stone}`)
            .circuit(0)
            .inputFluids(Fluid.of('gtceu:concrete', 72))
            .itemOutputs(`tfc:rock/cobble/${stone}`)
            .duration(50)
            .EUt(2)

        // Булыжник -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_cobble_stairs` })

        generateCutterRecipe(event, `tfc:rock/cobble/${stone}`, 0, [`tfc:rock/cobble/${stone}_stairs`, stoneDust], 100, 8, `${stone}_cobble_to_stairs`)

        // Булыжник -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_cobble_slab` })

        generateCutterRecipe(event, `tfc:rock/cobble/${stone}`, 1, [`2x tfc:rock/cobble/${stone}_slab`, stoneDust], 100, 8, `${stone}_cobble_to_slab`)

        // Булыжник -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_cobble_wall` })

        generateCutterRecipe(event, `tfc:rock/cobble/${stone}`, 2, [`tfc:rock/cobble/${stone}_wall`, stoneDust], 100, 8, `${stone}_cobble_to_wall`)

        //#endregion

        //#region Гладкий

        // Сырой камень -> Гладкий
        event.recipes.gtceu.laser_engraver(`raw_${stone}_to_smooth`)             
            .itemInputs(`tfc:rock/raw/${stone}`)
            .notConsumable('gtceu:glass_lens')
            .itemOutputs(`tfc:rock/smooth/${stone}`)
            .duration(32)
            .EUt(100)

        // Укрепленный сырой камень -> Гладкий
        event.recipes.gtceu.laser_engraver(`hardened_${stone}_to_smooth`)             
            .itemInputs(`tfc:rock/hardened/${stone}`)
            .notConsumable('gtceu:glass_lens')
            .itemOutputs(`tfc:rock/smooth/${stone}`)
            .duration(32)
            .EUt(100)

        // Булыжник -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_smooth_stairs` })

        generateCutterRecipe(event, `tfc:rock/smooth/${stone}`, 0, [`tfc:rock/smooth/${stone}_stairs`, stoneDust], 100, 8, `${stone}_smooth_to_stairs`)

        // Булыжник -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_smooth_slab` })

        generateCutterRecipe(event, `tfc:rock/smooth/${stone}`, 1, [`2x tfc:rock/smooth/${stone}_slab`, stoneDust], 100, 8, `${stone}_smooth_to_slab`)

        // Булыжник -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_smooth_wall` })

        generateCutterRecipe(event, `tfc:rock/smooth/${stone}`, 2, [`tfc:rock/smooth/${stone}_wall`, stoneDust], 100, 8, `${stone}_smooth_to_wall`)

        //#endregion
    
        //#region Кирпич

        // Кирпич -> Блок кирпичей
        event.recipes.gtceu.assembler(`bricks_${stone}`)             
            .itemInputs(`5x tfc:brick/${stone}`)
            .circuit(0)
            .inputFluids(Fluid.of('gtceu:concrete', 72))
            .itemOutputs(`4x tfc:rock/bricks/${stone}`)
            .duration(50)
            .EUt(2)

        // Блок кирпичей -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_bricks_stairs` })

        generateCutterRecipe(event, `tfc:rock/bricks/${stone}`, 0, [`tfc:rock/bricks/${stone}_stairs`, stoneDust], 100, 8, `${stone}_bricks_to_stairs`)

        // Блок кирпичей -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_bricks_slab` })

        generateCutterRecipe(event, `tfc:rock/bricks/${stone}`, 1, [`2x tfc:rock/bricks/${stone}_slab`, stoneDust], 100, 8, `${stone}_bricks_to_slab`)

        // Блок кирпичей -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_bricks_wall` })

        generateCutterRecipe(event, `tfc:rock/bricks/${stone}`, 2, [`tfc:rock/bricks/${stone}_wall`, stoneDust], 100, 8, `${stone}_bricks_to_wall`)

        //#endregion
    
        //#region Потрескавшийся кирпич
        
        // Кирпич -> Потрескавшийся кирпич
        event.recipes.gtceu.forge_hammer(`cracked_bricks_${stone}`)             
            .itemInputs(`tfc:rock/bricks/${stone}`)
            .itemOutputs(`tfc:rock/cracked_bricks/${stone}`)
            .duration(25)
            .EUt(8)

        // Потрескавшийся кирпич -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_cracked_bricks_stairs` })

        generateCutterRecipe(event, `tfc:rock/cracked_bricks/${stone}`, 0, [`tfc:rock/cracked_bricks/${stone}_stairs`, stoneDust], 100, 8, `${stone}_cracked_bricks_to_stairs`)

        // Потрескавшийся кирпич -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_cracked_bricks_slab` })

        generateCutterRecipe(event, `tfc:rock/cracked_bricks/${stone}`, 1, [`2x tfc:rock/cracked_bricks/${stone}_slab`, stoneDust], 100, 8, `${stone}_cracked_bricks_to_slab`)

        // Потрескавшийся кирпич -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_cracked_bricks_wall` })

        generateCutterRecipe(event, `tfc:rock/cracked_bricks/${stone}`, 2, [`tfc:rock/cracked_bricks/${stone}_wall`, stoneDust], 100, 8, `${stone}_cracked_bricks_to_wall`)

        //#endregion

        //#region Замшелый булыжник

        // Булыжник -> Замшелый булыжник
        event.shaped(`tfc:rock/mossy_cobble/${stone}`, [
            'ABA',
            'BAB',
            'ABA'  
        ], {
            A: `tfc:rock/mossy_loose/${stone}`,
            B: '#tfc:mortar'
        }).id(`tfc:crafting/rock/${stone}_mossy_loose_rocks_to_cobble`)

        event.recipes.gtceu.assembler(`${stone}_mossy_loose_rocks_to_mossy_cobble`)             
            .itemInputs(`4x tfc:rock/mossy_loose/${stone}`)
            .circuit(0)
            .inputFluids(Fluid.of('gtceu:concrete', 72))
            .itemOutputs(`tfc:rock/mossy_cobble/${stone}`)
            .duration(50)
            .EUt(2)

        event.recipes.gtceu.assembler(`${stone}_cobble_rocks_to_mossy_cobble`)             
            .itemInputs(`tfc:rock/cobble/${stone}`, '#tfc:compost_greens_low')
            .circuit(0)
            .inputFluids(Fluid.of('minecraft:water', 144))
            .itemOutputs(`tfc:rock/mossy_cobble/${stone}`)
            .duration(50)
            .EUt(2)

        // Замшелый булыжник -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_mossy_cobble_stairs` })

        generateCutterRecipe(event, `tfc:rock/mossy_cobble/${stone}`, 0, [`tfc:rock/mossy_cobble/${stone}_stairs`, stoneDust], 100, 8, `${stone}_mossy_cobble_to_stairs`)

        //Замшелый булыжник -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_mossy_cobble_slab` })

        generateCutterRecipe(event, `tfc:rock/mossy_cobble/${stone}`, 1, [`2x tfc:rock/mossy_cobble/${stone}_slab`, stoneDust], 100, 8, `${stone}_mossy_cobble_to_slab`)

        // Замшелый булыжник -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_mossy_cobble_wall` })

        generateCutterRecipe(event, `tfc:rock/mossy_cobble/${stone}`, 2, [`tfc:rock/mossy_cobble/${stone}_wall`, stoneDust], 100, 8, `${stone}_mossy_cobble_to_wall`)

        //#endregion

        //#region Замшелый кирпич

        // Блок кирпичей -> Замшелый кирпич
        event.recipes.gtceu.assembler(`mossy_bricks_${stone}`)             
            .itemInputs(`tfc:rock/bricks/${stone}`, '#tfc:compost_greens_low')
            .circuit(0)
            .inputFluids(Fluid.of('minecraft:water', 144))
            .itemOutputs(`tfc:rock/mossy_bricks/${stone}`)
            .duration(50)
            .EUt(2)

        // Замшелый булыжник -> Ступени
        event.remove({ id: `tfc:crafting/rock/${stone}_mossy_bricks_stairs` })

        generateCutterRecipe(event, `tfc:rock/mossy_bricks/${stone}`, 0, [`tfc:rock/mossy_bricks/${stone}_stairs`, stoneDust], 100, 8, `${stone}_mossy_bricks_to_stairs`)

        //Замшелый булыжник -> Плиты
        event.remove({ id: `tfc:crafting/rock/${stone}_mossy_bricks_slab` })

        generateCutterRecipe(event, `tfc:rock/mossy_bricks/${stone}`, 1, [`2x tfc:rock/mossy_bricks/${stone}_slab`, stoneDust], 100, 8, `${stone}_mossy_bricks_to_slab`)

        // Замшелый булыжник -> Стена
        event.remove({ id: `tfc:crafting/rock/${stone}_mossy_bricks_wall` })

        generateCutterRecipe(event, `tfc:rock/mossy_bricks/${stone}`, 2, [`tfc:rock/mossy_bricks/${stone}_wall`, stoneDust], 100, 8, `${stone}_mossy_bricks_to_wall`)

        //#endregion
    
        //#region Укрепленный камень

        event.recipes.gtceu.assembler(`hardened_${stone}`)             
            .itemInputs(`5x tfc:rock/raw/${stone}`)
            .circuit(0)
            .inputFluids(Fluid.of('gtceu:concrete', 72))
            .itemOutputs(`2x tfc:rock/hardened/${stone}`)
            .duration(250)
            .EUt(8)

        //#endregion

        //#region Акведук

        event.recipes.gtceu.assembler(`aqueduct_${stone}`)             
            .itemInputs(`3x tfc:brick/${stone}`)
            .circuit(1)
            .inputFluids(Fluid.of('gtceu:concrete', 16))
            .itemOutputs(`tfc:rock/aqueduct/${stone}`)
            .duration(50)
            .EUt(2)

        //#endregion
    
        //#region Резной кирпич

        // Блок кирпичей -> Резной кирпич
        event.recipes.gtceu.laser_engraver(`chiseled_${stone}`)             
            .itemInputs(`tfc:rock/bricks/${stone}`)
            .notConsumable('gtceu:glass_lens')
            .itemOutputs(`tfc:rock/chiseled/${stone}`)
            .duration(32)
            .EUt(100)

        //#endregion
    
        //#region Декрафт блоков камня в пыль

        //#region Целый блок
        
        // Сырой
        event.recipes.gtceu.macerator(`raw_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/raw/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Булыжник
        event.recipes.gtceu.macerator(`cobble_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cobble/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Гладкий
        event.recipes.gtceu.macerator(`smooth_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/smooth/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Кирпичи
        event.recipes.gtceu.macerator(`bricks_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/bricks/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Потрескавшиеся кирпичи
        event.recipes.gtceu.macerator(`cracked_bricks_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cracked_bricks/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый булыжник
        event.recipes.gtceu.macerator(`mossy_cobble_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_cobble/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый кирпич
        event.recipes.gtceu.macerator(`mossy_bricks_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_bricks/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        //#endregion
        
        //#region Ступень
        
        // Сырой
        event.recipes.gtceu.macerator(`raw_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/raw/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Булыжник
        event.recipes.gtceu.macerator(`cobble_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cobble/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Гладкий
        event.recipes.gtceu.macerator(`smooth_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/smooth/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Кирпичи
        event.recipes.gtceu.macerator(`bricks_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/bricks/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Потрескавшиеся кирпичи
        event.recipes.gtceu.macerator(`cracked_bricks_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cracked_bricks/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый булыжник
        event.recipes.gtceu.macerator(`mossy_cobble_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_cobble/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый кирпич
        event.recipes.gtceu.macerator(`mossy_bricks_stairs_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_bricks/${stone}_stairs`)
            .itemOutputs(`6x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        //#endregion

        //#region Плита

        // Сырой
        event.recipes.gtceu.macerator(`raw_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/raw/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Булыжник
        event.recipes.gtceu.macerator(`cobble_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cobble/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Гладкий
        event.recipes.gtceu.macerator(`smooth_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/smooth/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Кирпичи
        event.recipes.gtceu.macerator(`bricks_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/bricks/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Потрескавшиеся кирпичи
        event.recipes.gtceu.macerator(`cracked_bricks_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cracked_bricks/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый булыжник
        event.recipes.gtceu.macerator(`mossy_cobble_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_cobble/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый кирпич
        event.recipes.gtceu.macerator(`mossy_bricks_slab_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_bricks/${stone}_slab`)
            .itemOutputs(`2x gtceu:small_${stone}_dust`)
            .duration(4)
            .EUt(75)

        //#endregion
        
        //#region Стена

        // Сырой
        event.recipes.gtceu.macerator(`raw_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/raw/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Булыжник
        event.recipes.gtceu.macerator(`cobble_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cobble/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Гладкий
        event.recipes.gtceu.macerator(`smooth_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/smooth/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Кирпичи
        event.recipes.gtceu.macerator(`bricks_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/bricks/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Потрескавшиеся кирпичи
        event.recipes.gtceu.macerator(`cracked_bricks_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/cracked_bricks/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый булыжник
        event.recipes.gtceu.macerator(`mossy_cobble_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_cobble/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Замшелый кирпич
        event.recipes.gtceu.macerator(`mossy_bricks_wall_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/mossy_bricks/${stone}_wall`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        //#endregion

        // Резной кирпич
        event.recipes.gtceu.macerator(`chiseled_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/chiseled/${stone}`)
            .itemOutputs(`gtceu:${stone}_dust`)
            .duration(4)
            .EUt(75)

        // Укрепленный
        event.recipes.gtceu.macerator(`hardened_${stone}_to_dust`)             
            .itemInputs(`tfc:rock/hardened/${stone}`)
            .itemOutputs(`2x gtceu:${stone}_dust`)
            .duration(8)
            .EUt(150)

        //#endregion
    })

    //#endregion

    //#region Песок

    // Песок душ -> Желтый песок
    // TODO: Включить после добавления ада
    /*
    event.recipes.gtceu.centrifuge('soul_sand_separation')             
        .itemInputs('minecraft:soul_sand')
        .chancedOutput('tfc:sand/yellow', 9000, 130)
        .chancedOutput('gtceu:small_saltpeter_dust', 8000, 480)
        .chancedOutput('gtceu:tiny_coal_dust', 2000, 340)
        .outputFluids(Fluid.of('gtceu:oil', 80))
        .duration(200)
        .EUt(80)*/

    // Нефтеносный -> Желтый песок
    event.recipes.gtceu.centrifuge('oilsands_ore_separation')             
        .itemInputs('#forge:ores/oilsands')
        .chancedOutput('tfc:sand/yellow', 5000, 5000)
        .outputFluids(Fluid.of('gtceu:oil', 2000))
        .duration(200)
        .EUt(30)

    // Пыль нефтеносного песка -> Желтый песок
    event.recipes.gtceu.centrifuge('oilsands_dust_separation')             
        .itemInputs('gtceu:oilsands_dust')
        .chancedOutput('tfc:sand/yellow', 5000, 5000)
        .outputFluids(Fluid.of('gtceu:oil', 2000))
        .duration(200)
        .EUt(30)

    // Земля -> Желтый песок
    event.recipes.gtceu.centrifuge('dirt_separation')             
        .itemInputs('#tfc:dirt')
        .chancedOutput('gtceu:plant_ball', 1250, 700)
        .chancedOutput('tfc:sand/yellow', 5000, 1200)
        .chancedOutput('gtceu:tiny_clay_dust', 4000, 900)
        .duration(250)
        .EUt(30)

    // Рецепты где нужно итерироваться по всем цветам
    global.SAND_COLORS.forEach(sandColor => {
        // Песчанник -> Песок
        event.recipes.gtceu.forge_hammer(`raw_${sandColor}_sandstone_to_sand`)             
            .itemInputs(`tfc:raw_sandstone/${sandColor}`)
            .itemOutputs(`tfc:sand/${sandColor}`)
            .duration(400)
            .EUt(2)

        // Гладкий песчанник -> Песок
        event.recipes.gtceu.forge_hammer(`smooth_${sandColor}_sandstone_to_sand`)             
            .itemInputs(`tfc:smooth_sandstone/${sandColor}`)
            .itemOutputs(`tfc:sand/${sandColor}`)
            .duration(400)
            .EUt(2)

        // Обрезанный песчанник -> Песок
        event.recipes.gtceu.forge_hammer(`cut_${sandColor}_sandstone_to_sand`)             
            .itemInputs(`tfc:cut_sandstone/${sandColor}`)
            .itemOutputs(`tfc:sand/${sandColor}`)
            .duration(400)
            .EUt(2)
        
        // Песок -> Песчанник
        event.recipes.gtceu.compressor(`sand_${sandColor}_to_sandstone`)             
            .itemInputs(`4x tfc:sand/${sandColor}`)
            .itemOutputs(`tfc:raw_sandstone/${sandColor}`)
            .duration(800)
            .EUt(2)

        // Песчанник -> Гладкий песчанник
        event.stonecutting(`tfc:smooth_sandstone/${sandColor}`, `tfc:raw_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/raw_sandstone_${sandColor}_to_smooth_sandstone`)

        generateCutterRecipe(event, `tfc:raw_sandstone/${sandColor}`, 3, `tfc:smooth_sandstone/${sandColor}`, 100, 8, `raw_sandstone_${sandColor}_to_smooth_sandstone`)

        // Песчанник -> Обрезанный песчанник
        event.stonecutting(`tfc:cut_sandstone/${sandColor}`, `tfc:raw_sandstone/${sandColor}`)
            .id(`raw_sandstone_${sandColor}_to_cut_sandstone`)

        generateCutterRecipe(event, `tfc:raw_sandstone/${sandColor}`, 4, `tfc:cut_sandstone/${sandColor}`, 100, 8, `cut_sandstone_${sandColor}_to_smooth_sandstone`)

        // Песчанник -> Ступень
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_raw_stairs` })

        event.stonecutting(`tfc:raw_sandstone/${sandColor}_stairs`, `tfc:raw_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_sandstone_to_stairs`)

        generateCutterRecipe(event, `tfc:raw_sandstone/${sandColor}`, 0, `tfc:raw_sandstone/${sandColor}_stairs`, 100, 8, `${sandColor}_sandstone_to_stairs`)

        // Песчанник -> Плита
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_raw_slab` })

        event.stonecutting(`2x tfc:raw_sandstone/${sandColor}_slab`, `tfc:raw_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_sandstone_to_slabs`)

        generateCutterRecipe(event, `tfc:raw_sandstone/${sandColor}`, 1, `2x tfc:raw_sandstone/${sandColor}_slab`, 100, 8, `${sandColor}_sandstone_to_slab`)

        // Песчанник -> Стена
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_raw_wall` })

        event.stonecutting(`tfc:raw_sandstone/${sandColor}_wall`, `tfc:raw_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_sandstone_to_wall`)

        generateCutterRecipe(event, `tfc:raw_sandstone/${sandColor}`, 2, `tfc:raw_sandstone/${sandColor}_wall`, 100, 8, `${sandColor}_sandstone_to_wall`)

        // Гладкий песчанник -> Ступень
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_smooth_stairs` })

        event.stonecutting(`tfc:smooth_sandstone/${sandColor}_stairs`, `tfc:smooth_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_smooth_sandstone_to_stairs`)

        generateCutterRecipe(event, `tfc:smooth_sandstone/${sandColor}`, 0, `tfc:smooth_sandstone/${sandColor}_stairs`, 100, 8, `${sandColor}_smooth_sandstone_to_stairs`)

        // Гладкий песчанник -> Плита
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_smooth_slab` })

        event.stonecutting(`2x tfc:smooth_sandstone/${sandColor}_slab`, `tfc:smooth_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_smooth_sandstone_to_slab`)

        generateCutterRecipe(event, `tfc:smooth_sandstone/${sandColor}`, 1, `2x tfc:smooth_sandstone/${sandColor}_slab`, 100, 8, `${sandColor}_smooth_sandstone_to_slab`)

        // Гладкий песчанник -> Стена
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_smooth_wall` })

        event.stonecutting(`tfc:smooth_sandstone/${sandColor}_wall`, `tfc:smooth_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_smooth_sandstone_to_wall`)

        generateCutterRecipe(event, `tfc:smooth_sandstone/${sandColor}`, 2, `tfc:smooth_sandstone/${sandColor}_wall`, 100, 8, `${sandColor}_smooth_sandstone_to_wall`)

        // Обрезанный песчанник -> Ступень
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_cut_stairs` })

        event.stonecutting(`tfc:cut_sandstone/${sandColor}_stairs`, `tfc:cut_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_cut_sandstone_to_stairs`)

        generateCutterRecipe(event, `tfc:cut_sandstone/${sandColor}`, 0, `tfc:cut_sandstone/${sandColor}_stairs`, 100, 8, `${sandColor}_cut_sandstone_to_stairs`)

        // Обрезанный песчанник -> Плита
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_cut_slab` })

        event.stonecutting(`2x tfc:cut_sandstone/${sandColor}_slab`, `tfc:cut_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_cut_sandstone_to_slab`)

        generateCutterRecipe(event, `tfc:cut_sandstone/${sandColor}`, 1, `2x tfc:cut_sandstone/${sandColor}_slab`, 100, 8, `${sandColor}_cut_sandstone_to_slab`)

        // Обрезанный песчанник -> Стена
        event.remove({ id: `tfc:crafting/sandstone/${sandColor}_cut_wall` })

        event.stonecutting(`tfc:cut_sandstone/${sandColor}_wall`, `tfc:cut_sandstone/${sandColor}`)
            .id(`tfg:stonecutting/${sandColor}_cut_sandstone_to_wall`)

        generateCutterRecipe(event, `tfc:cut_sandstone/${sandColor}`, 2, `tfc:cut_sandstone/${sandColor}_wall`, 100, 8, `${sandColor}_cut_sandstone_to_wall`)
    })
    
    // Коричневый гравий -> Песок
    event.recipes.gtceu.forge_hammer('brown_gravel_to_sand')             
        .itemInputs('#tfc:brown_gravel')
        .itemOutputs('tfc:sand/brown')
        .duration(400)
        .EUt(2)

    // Белый гравий -> Песок
    event.recipes.gtceu.forge_hammer('white_gravel_to_sand')             
        .itemInputs('#tfc:white_gravel')
        .itemOutputs('tfc:sand/white')
        .duration(400)
        .EUt(2)

    // Черный гравий -> Песок
    event.recipes.gtceu.forge_hammer('black_gravel_to_sand')             
        .itemInputs('#tfc:black_gravel')
        .itemOutputs('tfc:sand/black')
        .duration(400)
        .EUt(2)

    // Красный гравий -> Песок
    event.recipes.gtceu.forge_hammer('red_gravel_to_sand')             
        .itemInputs('#tfc:red_gravel')
        .itemOutputs('tfc:sand/red')
        .duration(400)
        .EUt(2)

    // Желтый гравий -> Песок
    event.recipes.gtceu.forge_hammer('yellow_gravel_to_sand')             
        .itemInputs('#tfc:yellow_gravel')
        .itemOutputs('tfc:sand/yellow')
        .duration(400)
        .EUt(2)

    // Зеленый гравий -> Песок
    event.recipes.gtceu.forge_hammer('green_gravel_to_sand')             
        .itemInputs('#tfc:green_gravel')
        .itemOutputs('tfc:sand/green')
        .duration(400)
        .EUt(2)

    // Розовый гравий -> Песок
    event.recipes.gtceu.forge_hammer('pink_gravel_to_sand')             
        .itemInputs('#tfc:pink_gravel')
        .itemOutputs('tfc:sand/pink')
        .duration(400)
        .EUt(2)

    //#endregion

    //#region Дерево
    
    // Декрафт деревянной херни в деревянную пыль
    Object.entries(global.TFC_WOOD_ITEM_TYPES_TO_WOOD_DUST).forEach(pair => {
        
        let typeName = pair[1].name
        let typeOutput = pair[1].output
        
        event.recipes.gtceu.macerator(`tfg/macerate_${typeName}`)             
            .itemInputs(pair[0])
            .itemOutputs(typeOutput)
            .duration(600)
            .EUt(2)
    })

    global.TFC_WOOD_TYPES.forEach(wood => {
        event.remove({ id: `tfc:crafting/wood/${wood}_axle` })
        event.remove({ id: `tfc:crafting/wood/${wood}_bladed_axle` })
        event.remove({ id: `tfc:crafting/wood/${wood}_encased_axle` })
        event.remove({ id: `tfc:crafting/wood/${wood}_clutch` })
        event.remove({ id: `tfc:crafting/wood/${wood}_gear_box` })
        event.remove({ id: `tfc:crafting/wood/${wood}_water_wheel` })
    
        // Бревна -> Пиломатериалы
        generateCutterRecipe(event, `#tfc:${wood}_logs`, null, `16x tfc:wood/lumber/${wood}`, 400, 10, `${wood}_lumber_from_log`)

        // Доски -> Пиломатериалы
        generateCutterRecipe(event, `tfc:wood/planks/${wood}`, null, `4x tfc:wood/lumber/${wood}`, 400, 10, `${wood}_lumber_from_planks`)

        // Ступень -> Пиломатериалы
        generateCutterRecipe(event, `tfc:wood/planks/${wood}_stairs`, null, `3x tfc:wood/lumber/${wood}`, 400, 10, `${wood}_lumber_from_stairs`)
    

        // Плита -> Пиломатериалы
        generateCutterRecipe(event, `tfc:wood/planks/${wood}_slab`, null, `2x tfc:wood/lumber/${wood}`, 400, 10, `${wood}_lumber_from_slab`)

        // ? -> Деревянная нажимная пластина
        event.shaped(`tfc:wood/planks/${wood}_pressure_plate`, [
            'ABA',
            'CDC',
            'AEA'  
        ], {
            A: '#forge:screws/wood',
            B: '#tfc:hammers',
            C: `tfc:wood/planks/${wood}_slab`,
            D: '#forge:springs',
            E: '#forge:tools/screwdrivers'
        }).id(`tfc:crafting/wood/${wood}_pressure_plate`)

        event.recipes.gtceu.assembler(`${wood}_pressure_plate`)             
            .itemInputs('#forge:springs', `2x tfc:wood/planks/${wood}_slab`)
            .circuit(0)
            .itemOutputs(`2x tfc:wood/planks/${wood}_pressure_plate`)
            .duration(50)
            .EUt(2)

        // ? -> Деревянная кнопка
        event.remove({ id: `tfc:crafting/wood/${wood}_button` })

        generateCutterRecipe(event, `tfc:wood/planks/${wood}_pressure_plate`, null, `6x tfc:wood/planks/${wood}_button`, 50, 2, `${wood}_button`)
        
    })

    //#endregion

    //#region Рецепты порошков
    
    // Удаление рецептов
    event.remove({ id: 'tfc:quern/amethyst' })
    event.remove({ id: 'tfc:quern/amethyst_cut' })
    event.remove({ id: 'tfc:quern/blaze_rod' })
    event.remove({ id: 'tfc:quern/borax' })
    event.remove({ id: 'tfc:quern/charcoal' })
    event.remove({ id: 'tfc:quern/cinnabar' })
    event.remove({ id: 'tfc:quern/cryolite' })
    event.remove({ id: 'tfc:quern/diamond' })
    event.remove({ id: 'tfc:quern/diamond_cut' })
    event.remove({ id: 'tfc:quern/emerald' })
    event.remove({ id: 'tfc:quern/emerald_cut' })
    event.remove({ id: 'tfc:quern/graphite' })
    event.remove({ id: 'tfc:quern/lapis_lazuli' })
    event.remove({ id: 'tfc:quern/lapis_lazuli_cut' })
    event.remove({ id: 'tfc:quern/normal_bismuthinite' })
    event.remove({ id: 'tfc:quern/normal_cassiterite' })
    event.remove({ id: 'tfc:quern/normal_garnierite' })
    event.remove({ id: 'tfc:quern/normal_hematite' })
    event.remove({ id: 'tfc:quern/normal_limonite' })
    event.remove({ id: 'tfc:quern/normal_magnetite' })
    event.remove({ id: 'tfc:quern/normal_malachite' })
    event.remove({ id: 'tfc:quern/normal_native_copper' })
    event.remove({ id: 'tfc:quern/normal_native_gold' })
    event.remove({ id: 'tfc:quern/normal_native_silver' })
    event.remove({ id: 'tfc:quern/normal_sphalerite' })
    event.remove({ id: 'tfc:quern/normal_tetrahedrite' })
    event.remove({ id: 'tfc:quern/opal' })
    event.remove({ id: 'tfc:quern/opal_cut' })
    event.remove({ id: 'tfc:quern/poor_bismuthinite' })
    event.remove({ id: 'tfc:quern/poor_cassiterite' })
    event.remove({ id: 'tfc:quern/poor_garnierite' })
    event.remove({ id: 'tfc:quern/poor_hematite' })
    event.remove({ id: 'tfc:quern/poor_limonite' })
    event.remove({ id: 'tfc:quern/poor_magnetite' })
    event.remove({ id: 'tfc:quern/poor_malachite' })
    event.remove({ id: 'tfc:quern/poor_native_copper' })
    event.remove({ id: 'tfc:quern/poor_native_gold' })
    event.remove({ id: 'tfc:quern/poor_native_silver' })
    event.remove({ id: 'tfc:quern/poor_sphalerite' })
    event.remove({ id: 'tfc:quern/poor_tetrahedrite' })
    event.remove({ id: 'tfc:quern/pyrite' })
    event.remove({ id: 'tfc:quern/pyrite_cut' })
    event.remove({ id: 'tfc:quern/raw_limestone' })
    event.remove({ id: 'tfc:quern/rich_bismuthinite' })
    event.remove({ id: 'tfc:quern/rich_cassiterite' })
    event.remove({ id: 'tfc:quern/rich_garnierite' })
    event.remove({ id: 'tfc:quern/rich_hematite' })
    event.remove({ id: 'tfc:quern/rich_limonite' })
    event.remove({ id: 'tfc:quern/rich_magnetite' })
    event.remove({ id: 'tfc:quern/rich_malachite' })
    event.remove({ id: 'tfc:quern/rich_native_copper' })
    event.remove({ id: 'tfc:quern/rich_native_gold' })
    event.remove({ id: 'tfc:quern/rich_native_silver' })
    event.remove({ id: 'tfc:quern/rich_sphalerite' })
    event.remove({ id: 'tfc:quern/rich_tetrahedrite' })
    event.remove({ id: 'tfc:quern/ruby' })
    event.remove({ id: 'tfc:quern/ruby_cut' })
    event.remove({ id: 'tfc:quern/salt' })
    event.remove({ id: 'tfc:quern/saltpeter' })
    event.remove({ id: 'tfc:quern/sapphire' })
    event.remove({ id: 'tfc:quern/sapphire_cut' })
    event.remove({ id: 'tfc:quern/sulfur' })
    event.remove({ id: 'tfc:quern/sylvite' })
    event.remove({ id: 'tfc:quern/topaz' })
    event.remove({ id: 'tfc:quern/topaz_cut' })

    // Добавление рецептов
    global.TFC_QUERN_POWDER_RECIPE_COMPONENTS.forEach(element => {
        event.recipes.gtceu.macerator(`tfg:${element.name}`)             
            .itemInputs(element.input)
            .itemOutputs(element.output)
            .duration(60)
            .EUt(2)

        event.recipes.tfc.quern(element.output, element.input)
            .id(`tfg:quern/${element.name}`)

        event.recipes.createMilling(element.output, element.input)
            .id(`tfg:milling/${element.name}`)
    })

    //#endregion

    //#region Рецепты зерен

    global.TFC_QUERN_GRAIN_RECIPE_COMPONENTS.forEach(element => {
        
        event.recipes.gtceu.macerator(`tfg:${element.name}`)             
            .itemInputs(element.input)
            .itemOutputs(element.output)
            .chancedOutput('tfc:straw', 7000, 500)
            .duration(200)
            .EUt(16)

        event.recipes.tfc.quern(element.output, element.input)
            .id(`tfg:quern/${element.name}`)

        event.recipes.createMilling(element.output, element.input)
            .id(`tfg:milling/${element.name}`)
    })

    //#endregion

    //#region Рецепты муки

    global.TFC_QUERN_FLOUR_RECIPE_COMPONENTS.forEach(element => {
        event.recipes.gtceu.macerator(`tfg:${element.name}`)             
            .itemInputs(element.input)
            .itemOutputs(element.output)
            .duration(200)
            .EUt(16)

        event.recipes.createMilling(element.output, element.input)
            .id(`tfg:milling/${element.name}`)
    })

    //#endregion

    //#region Рецепты обжарки мяса

    global.TFC_FURNACE_MEAT_RECIPE_COMPONENTS.forEach(element => {
        event.smelting(element.output, element.input)
            .id(`tfg:smelting/${element.name}`)
    })

    //#endregion

    //#region Рецепты обжарки форм
    
    global.TFC_FURNACE_MOLD_RECIPE_COMPONENTS.forEach(element => {
        event.smelting(element.output, element.input)
            .id(`tfg:smelting/${element.name}`)
    })

    global.MINECRAFT_DYE_NAMES.forEach(dye => {
        event.smelting(`tfc:ceramic/${dye}_glazed_vessel`, `tfc:ceramic/${dye}_unfired_vessel`)
            .id(`tfg:smelting/${dye}_glazed_vessel`)

        event.smelting(`tfc:ceramic/large_vessel/${dye}`, `tfc:ceramic/unfired_large_vessel/${dye}`)
            .id(`tfg:smelting/${dye}_large_vessel`)
    })

    //#endregion

    //#region Покраска малых и больших сосудов

    //#region Обычный сосуд
    
    event.recipes.gtceu.chemical_bath(`unfired_vessel_decolor`)             
        .itemInputs('#tfc:colorized_unfired_vessels')
        .inputFluids(Fluid.of(`gtceu:chlorine`, 36))
        .itemOutputs('tfc:ceramic/unfired_vessel')
        .duration(300)
        .EUt(4)

    event.recipes.gtceu.chemical_bath(`fired_vessel_decolor`)             
        .itemInputs('#tfc:colorized_fired_vessels')
        .inputFluids(Fluid.of(`gtceu:chlorine`, 36))
        .itemOutputs('tfc:ceramic/vessel')
        .duration(300)
        .EUt(4)

    global.MINECRAFT_DYE_NAMES.forEach(dye => {
        event.recipes.gtceu.chemical_bath(`${dye}_unfired_vessel`)             
            .itemInputs('tfc:ceramic/unfired_vessel')
            .inputFluids(Fluid.of(`gtceu:${dye}_dye`, 36))
            .itemOutputs(`tfc:ceramic/${dye}_unfired_vessel`)
            .duration(150)
            .EUt(4)

        event.recipes.gtceu.chemical_bath(`${dye}_vessel`)             
            .itemInputs('tfc:ceramic/vessel')
            .inputFluids(Fluid.of(`gtceu:${dye}_dye`, 36))
            .itemOutputs(`tfc:ceramic/${dye}_glazed_vessel`)
            .duration(150)
            .EUt(4)
    })

    //#endregion

    //#region Большой сосуд
    
    event.recipes.gtceu.chemical_bath(`unfired_large_vessel_decolor`)             
        .itemInputs('#tfc:colorized_unfired_large_vessels')
        .inputFluids(Fluid.of(`gtceu:chlorine`, 72))
        .itemOutputs('tfc:ceramic/unfired_large_vessel')
        .duration(300)
        .EUt(4)

    event.recipes.gtceu.chemical_bath(`fired_large_vessel_decolor`)             
        .itemInputs('#tfc:colorized_fired_large_vessels')
        .inputFluids(Fluid.of(`gtceu:chlorine`, 72))
        .itemOutputs('tfc:ceramic/large_vessel')
        .duration(300)
        .EUt(4)

    global.MINECRAFT_DYE_NAMES.forEach(dye => {
        event.recipes.gtceu.chemical_bath(`${dye}_large_unfired_vessel`)             
            .itemInputs('tfc:ceramic/unfired_large_vessel')
            .inputFluids(Fluid.of(`gtceu:${dye}_dye`, 72))
            .itemOutputs(`tfc:ceramic/unfired_large_vessel/${dye}`)
            .duration(150)
            .EUt(4)

        event.recipes.gtceu.chemical_bath(`${dye}_large_vessel`)             
            .itemInputs('tfc:ceramic/large_vessel')
            .inputFluids(Fluid.of(`gtceu:${dye}_dye`, 72))
            .itemOutputs(`tfc:ceramic/large_vessel/${dye}`)
            .duration(150)
            .EUt(4)
    })

    //#endregion

    //#endregion

    //#region Удаление рецептов лопастей ветряной мельницы

    event.remove({ id: `tfc:crafting/windmill_blade` })
    event.remove({ id: `tfc:barrel/dye/bleach_windmill_blades` })

    global.MINECRAFT_DYE_NAMES.forEach(dye => {
        event.remove({ id: `tfc:barrel/dye/${dye}_windmill_blade` })
    })

    //#endregion

    //#region Удаление рецептов каменных инструментов TFC

    //#region Топор

    // Инструмент
    event.remove({ id: `tfc:crafting/stone/axe_igneous_extrusive` })
    event.remove({ id: `tfc:crafting/stone/axe_igneous_intrusive` })
    event.remove({ id: `tfc:crafting/stone/axe_metamorphic` })
    event.remove({ id: `tfc:crafting/stone/axe_sedimentary` })

    // Оголовья
    event.remove({ id: `tfc:rock_knapping/axe_head_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/axe_head_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/axe_head_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/axe_head_sedimentary` })

    event.recipes.tfc.knapping('gtceu:stone_axe_head', 'tfc:rock', [
            " X   ",
            "XXXX ",
            "XXXXX",
            "XXXX ",
            " X   "
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_axe_head')

    //#endregion

    //#region Молот

    // Инструмент
    event.remove({ id: `tfc:crafting/stone/hammer_igneous_extrusive` })
    event.remove({ id: `tfc:crafting/stone/hammer_igneous_intrusive` })
    event.remove({ id: `tfc:crafting/stone/hammer_metamorphic` })
    event.remove({ id: `tfc:crafting/stone/hammer_sedimentary` })

    // Оголовья
    event.remove({ id: `tfc:rock_knapping/hammer_head_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/hammer_head_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/hammer_head_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/hammer_head_sedimentary` })

    event.recipes.tfc.knapping('gtceu:stone_hammer_head', 'tfc:rock', [
            "XXXXX",
            "XXXXX",
            "  X  "
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_hammer_head')

    //#endregion

    //#region Мотыга

    // Инструмент
    event.remove({ id: `tfc:crafting/stone/hoe_igneous_extrusive` })
    event.remove({ id: `tfc:crafting/stone/hoe_igneous_intrusive` })
    event.remove({ id: `tfc:crafting/stone/hoe_metamorphic` })
    event.remove({ id: `tfc:crafting/stone/hoe_sedimentary` })

    // Оголовья
    event.remove({ id: `tfc:rock_knapping/hoe_head_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_1_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_2_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_1_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_2_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_1_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_2_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_sedimentary` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_1_sedimentary` })
    event.remove({ id: `tfc:rock_knapping/hoe_head_2_sedimentary` })

    event.recipes.tfc.knapping('gtceu:stone_hoe_head', 'tfc:rock', [
            "XXXXX",
            "   XX"
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_hoe_head')

    event.recipes.tfc.knapping('2x gtceu:stone_hoe_head', 'tfc:rock', [
            "XXXXX",
            "XX   ",
            "     ",
            "XXXXX",
            "XX   "
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_hoe_head_1')

    event.recipes.tfc.knapping('2x gtceu:stone_hoe_head', 'tfc:rock', [
            "XXXXX",
            "XX   ",
            "     ",
            "XXXXX",
            "   XX"
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_hoe_head_2')

    //#endregion

    //#region Нож

    // Инструмент
    event.remove({ id: `tfc:crafting/stone/knife_igneous_extrusive` })
    event.remove({ id: `tfc:crafting/stone/knife_igneous_intrusive` })
    event.remove({ id: `tfc:crafting/stone/knife_metamorphic` })
    event.remove({ id: `tfc:crafting/stone/knife_sedimentary` })

    // Оголовья
    event.remove({ id: `tfc:rock_knapping/knife_head_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_1_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_2_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_3_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_1_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_2_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_3_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/knife_head_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/knife_head_1_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/knife_head_2_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/knife_head_3_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/knife_head_sedimentary` })
    event.remove({ id: `tfc:rock_knapping/knife_head_1_sedimentary` })
    event.remove({ id: `tfc:rock_knapping/knife_head_2_sedimentary` })
    event.remove({ id: `tfc:rock_knapping/knife_head_3_sedimentary` })

    event.recipes.tfc.knapping('gtceu:stone_knife_head', 'tfc:rock', [
            "X ",
            "XX",
            "XX",
            "XX",
            "XX"
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_knife_head')

    event.recipes.tfc.knapping('2x gtceu:stone_knife_head', 'tfc:rock', [
            "X  X ",
            "XX XX",
            "XX XX",
            "XX XX",
            "XX XX"
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_knife_head_1')

    event.recipes.tfc.knapping('2x gtceu:stone_knife_head', 'tfc:rock', [
            "X   X",
            "XX XX",
            "XX XX",
            "XX XX",
            "XX XX"
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_knife_head_2')

    event.recipes.tfc.knapping('2x gtceu:stone_knife_head', 'tfc:rock', [
            " X X ",
            "XX XX",
            "XX XX",
            "XX XX",
            "XX XX"
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_knife_head_3')

    //#endregion

    //#region Лопата

    // Инструмент
    event.remove({ id: `tfc:crafting/stone/shovel_igneous_extrusive` })
    event.remove({ id: `tfc:crafting/stone/shovel_igneous_intrusive` })
    event.remove({ id: `tfc:crafting/stone/shovel_metamorphic` })
    event.remove({ id: `tfc:crafting/stone/shovel_sedimentary` })

    // Оголовья
    event.remove({ id: `tfc:rock_knapping/shovel_head_igneous_extrusive` })
    event.remove({ id: `tfc:rock_knapping/shovel_head_igneous_intrusive` })
    event.remove({ id: `tfc:rock_knapping/shovel_head_metamorphic` })
    event.remove({ id: `tfc:rock_knapping/shovel_head_sedimentary` })

    event.recipes.tfc.knapping('gtceu:stone_shovel_head', 'tfc:rock', [
            "XXX",
            "XXX",
            "XXX",
            "XXX",
            " X "
        ])
        .ingredient('#tfc:rock_knapping')
        .outsideSlotRequired(false)
        .id('tfg:rock_knapping/stone_shovel_head')

    //#endregion

    //#endregion

    //#region Рецепты электрической теплицы
    
    // Дерево
    global.TFC_WOOD_TYPES.forEach(wood => {
        generateGreenHouseRecipe(event, `tfc:wood/sapling/${wood}`, 16000, `32x tfc:wood/log/${wood}`, `tfg:greenhouse/${wood}`)
    })

    // Семена фруктов
    global.TFC_GREENHOUSE_FRUIT_RECIPE_COMPONENTS.forEach(element => {
        generateGreenHouseRecipe(event, element.input, element.fluid_amount, element.output, element.name)
    })

    // Семена овощей
    global.TFC_GREENHOUSE_VEGETABLE_RECIPE_COMPONENTS.forEach(element => {
        generateGreenHouseRecipe(event, element.input, element.fluid_amount, element.output, element.name)
    })

    // Семена ягод
    global.TFC_GREENHOUSE_BERRY_RECIPE_COMPONENTS.forEach(element => {
        generateGreenHouseRecipe(event, element.input, element.fluid_amount, element.output, element.name)
    })

    //#endregion

    //#region Рецепты плоского теста

    global.TFC_MIXER_FLATBREAD_DOUGH_RECIPE_COMPONENTS.forEach(element => {
        event.recipes.gtceu.mixer(element.name)             
            .itemInputs(element.input)
            .inputFluids(Fluid.of('minecraft:water', 100))
            .itemOutputs(element.output)
            .duration(300)
            .EUt(16)
    })

    //#endregion

    //#region Рецепты хлеба

    global.TFC_FURNACE_BREAD_RECIPE_COMPONENTS.forEach(element => {
        event.smelting(element.output, element.input)
            .id(`tfg:smelting/${element.name}`)
    })

    //#endregion

    //#region Молды в ассемблере

    for (let i = 0; i < global.TFC_CLAY_TO_UNFIRED_MOLD_RECIPE_COMPONENTS.length; i++) {
        
        let element = global.TFC_CLAY_TO_UNFIRED_MOLD_RECIPE_COMPONENTS[i];

        event.recipes.gtceu.assembler(`tfg:tfc/${element.name}`)             
            .itemInputs(element.input)
            .circuit(i)
            .itemOutputs(element.output)
            .duration(450)
            .EUt(2)
    }


    //#endregion

    //#region Стеклянные смеси в бутылки в ассемблере

    global.TFC_BATCH_TO_BOTTLE_ASSEMBLING_RECIPE_COMPONENTS.forEach(element => {
        event.recipes.gtceu.alloy_smelter(`tfg:tfc/${element.name}`)             
            .itemInputs(element.input)
            .notConsumable('gtceu:bottle_casting_mold')
            .itemOutputs(element.output)
            .duration(100)
            .EUt(2)
    })

    //#endregion

    //#region Оливки

    event.recipes.gtceu.macerator(`tfg:tfc/olive_paste`)             
            .itemInputs('tfc:food/olive')
            .itemOutputs('2x tfc:olive_paste')
            .duration(60)
            .EUt(2)

    event.recipes.createMilling('2x tfc:olive_paste', 'tfc:food/olive')
        .id(`tfg:milling/tfc/olive_paste`)

    //#endregion

    //#region Рецепты бочки в миксере
    // А где?
    //#endregion

    // Другое
    event.remove({ id: `tfc:crafting/trip_hammer` })
    event.remove({ id: `tfc:anvil/steel_pump` })
    event.remove({ id: `tfc:crafting/steel_pump` })
    event.remove({ id: `tfc:crafting/crankshaft` })

    

    // Доменная печь
    event.shaped('tfc:blast_furnace', [
        'AAA', 
        'ABA',
        'AAA'  
    ], {
        A: '#forge:double_plates/wrought_iron',
        B: 'tfc:crucible'
    }).id('tfc:crafting/blast_furnace')

    // Тыква -> Кусочки тыквы
    event.recipes.minecraft.crafting_shaped('5x tfc:food/pumpkin_chunks', [
        'AB'
    ], {
        A: '#tfc:knives',
        B: 'tfc:pumpkin'
    })

    // Lime
    event.smelting('tfc:powder/lime', 'tfc:powder/flux')
        .id('tfg:smelting/lime')

    // Kaolinite Clay
    event.smelting('tfc:kaolin_clay', 'tfc:powder/kaolinite')
        .id('tfg:smelting/kaolinite_clay')

    // Fire Brick
    event.smelting('tfc:ceramic/fire_brick', 'gtceu:compressed_fireclay')
        .id('tfg:smelting/fireclay_brick')

    // Lamp Glass
    event.recipes.gtceu.alloy_smelter(`tfg:tfc/lamp_glass`)             
        .itemInputs('#tfc:glass_batches')
        .notConsumable('#tfc:metal_item/unfinished_lamps')
        .itemOutputs('tfc:lamp_glass')
        .duration(100)
        .EUt(2)

    // Glass lens
    event.recipes.gtceu.alloy_smelter(`tfg:tfc/glass_lens`)             
        .itemInputs('tfc:silica_glass_batch')
        .notConsumable('#forge:lenses')
        .itemOutputs('tfc:lens')
        .duration(100)
        .EUt(2)

    // Empty Jar
    event.recipes.gtceu.assembler(`tfg:tfc/glass_jar`)             
        .itemInputs('#tfc:glass_batches_tier_2')
        .circuit(2)
        .itemOutputs('tfc:empty_jar')
        .duration(100)
        .EUt(2)

    // Wool Yarn
    event.recipes.gtceu.macerator('macerate_wool')             
        .itemInputs('#minecraft:wool')
        .itemOutputs('tfc:wool_yarn')
        .chancedOutput('tfc:wool_yarn', 9000, 0)
        .chancedOutput('tfc:wool_yarn', 5000, 0)
        .chancedOutput('tfc:wool_yarn', 2000, 0)
        .duration(200)
        .EUt(2)

    // LimeWater + Sand -> Mortar
    event.recipes.gtceu.centrifuge('mortar')             
        .itemInputs('#forge:sand')
        .inputFluids(Fluid.of('tfc:limewater', 100))
        .itemOutputs('16x tfc:mortar')
        .duration(800)
        .EUt(8)

    // Brass Mechanism
    event.recipes.gtceu.assembler('tfg:tfc/brass_mechanism')             
        .itemInputs('#forge:plates/brass')
        .circuit(10)
        .itemOutputs('tfc:brass_mechanisms')
        .duration(100)
        .EUt(4)

    // 1x Small SheepSkin -> 1x Wool
    event.recipes.gtceu.assembler('tfg:tfc/wool_1')             
        .itemInputs('tfc:small_sheepskin_hide')
        .itemOutputs('tfc:wool')
        .duration(100)
        .EUt(4)

    // 1x Medium SheepSkin -> 1x Wool
    event.recipes.gtceu.assembler('tfg:tfc/wool_2')             
        .itemInputs('tfc:medium_sheepskin_hide')
        .itemOutputs('2x tfc:wool')
        .duration(100)
        .EUt(4)

    // 1x Large SheepSkin -> 1x Wool
    event.recipes.gtceu.assembler('tfg:tfc/wool_3')             
        .itemInputs('tfc:large_sheepskin_hide')
        .itemOutputs('3x tfc:wool')
        .duration(100)
        .EUt(4)

    // Wool Yarn
    event.recipes.gtceu.wiremill('tfg:tfc/wool_yarn')             
        .itemInputs('tfc:wool')
        .itemOutputs('8x tfc:wool_yarn')
        .duration(100)
        .EUt(4)

    // Burlap Cloth
    event.recipes.gtceu.assembler('tfg:tfc/burlap_cloth')             
        .itemInputs('12x tfc:jute_fiber')
        .itemOutputs('tfc:burlap_cloth')
        .duration(100)
        .EUt(4)

    // Silk Cloth
    event.recipes.gtceu.assembler('tfg:tfc/silk_cloth')             
        .itemInputs('24x minecraft:string')
        .itemOutputs('tfc:silk_cloth')
        .duration(100)
        .EUt(4)

    // Silk Cloth
    event.recipes.gtceu.assembler('tfg:tfc/wool_cloth')             
        .itemInputs('16x tfc:wool_yarn')
        .itemOutputs('tfc:wool_cloth')
        .duration(100)
        .EUt(4)

    // Jute Fiber
    generateMixerRecipe(event, 'tfc:jute', Fluid.of('minecraft:water', 200), 'tfc:jute_fiber', null, [], 100, 4, 16, 'tfg:tfc/jute_fiber')

    // Soda Ash
    event.smelting('3x tfc:powder/soda_ash', 'tfc:food/dried_seaweed').id('tfg:smelting/dried_seaweed_to_soda')
    event.smelting('3x tfc:powder/soda_ash', 'tfc:food/dried_kelp').id('tfg:smelting/dried_kelp_to_soda')

    //#region Обрушения

    event.recipes.tfc.collapse('#tfc:rock/slabs').id('tfg:collapse/rock_slabs')
    event.recipes.tfc.collapse('#tfc:rock/stairs').id('tfg:collapse/rock_stairs')
    event.recipes.tfc.collapse('#tfc:rock/walls').id('tfg:collapse/rock_walls')

    global.TFC_STONE_TYPES.forEach(stoneType => {
        event.custom({
            type: "tfc:collapse",
            ingredient: {
                tag: `forge:ores_in_ground/${stoneType}`
            },
            result: `tfc:rock/cobble/${stoneType}`
        }).id(`tfg:collapse/${stoneType}_gt_ores`)
    })
    
    //#endregion
    
    //#region Выход: Свечи

    event.recipes.gtceu.chemical_bath(`tfg:tfc/candle_decolor`)             
        .itemInputs('#tfc:colored_candles')
        .inputFluids(Fluid.of(`gtceu:chlorine`, 72))
        .itemOutputs('tfc:candle')
        .duration(300)
        .EUt(4)

    global.MINECRAFT_DYE_NAMES.forEach(dye => {
        
        event.recipes.gtceu.chemical_bath(`tfg:tfc/${dye}_candle`)             
            .itemInputs('tfc:candle')
            .inputFluids(Fluid.of(`gtceu:${dye}_dye`, 36))
            .itemOutputs(`tfc:candle/${dye}`)
            .duration(300)
            .EUt(4)

    })

    //#endregion

    //#region Алебастр

    event.recipes.tfc.damage_inputs_shapeless_crafting(event.recipes.minecraft.crafting_shapeless('4x tfc:alabaster_brick', ['#forge:raw_materials/gypsum', '#tfc:chisels']))
        .id('tfc:crafting/alabaster_brick/raw_gypsum')
        
    event.recipes.tfc.damage_inputs_shapeless_crafting(event.recipes.minecraft.crafting_shapeless('2x tfc:alabaster_brick', ['#forge:poor_raw_materials/gypsum', '#tfc:chisels']))
        .id('tfc:crafting/alabaster_brick/poor_raw_gypsum')

    event.recipes.tfc.damage_inputs_shapeless_crafting(event.recipes.minecraft.crafting_shapeless('6x tfc:alabaster_brick', ['#forge:rich_raw_materials/gypsum', '#tfc:chisels']))
        .id('tfc:crafting/alabaster_brick/rich_raw_gypsum')

    // Alabaster Brick
    event.recipes.gtceu.assembler('tfc:alabaster/bricks')             
        .itemInputs('5x tfc:alabaster_brick')
        .inputFluids(Fluid.of('gtceu:concrete', 72))
        .itemOutputs('4x tfc:alabaster/bricks')
        .duration(50)
        .EUt(2)

    event.recipes.gtceu.chemical_bath('tfc:alabaster/bricks')             
        .itemInputs('#tfc:colored_bricks_alabaster')
        .inputFluids(Fluid.of('gtceu:chlorine', 72))
        .itemOutputs('tfc:alabaster/bricks')
        .duration(400)
        .EUt(2)
    
    for (let i = 0; i < 16; i++) {
        event.recipes.gtceu.chemical_bath(`tfg:tfc/alabaster/bricks/${global.MINECRAFT_DYE_NAMES[i]}`)             
            .itemInputs('tfc:alabaster/bricks')
            .inputFluids(Fluid.of(`gtceu:${global.MINECRAFT_DYE_NAMES[i]}_dye`, 72))
            .itemOutputs(`tfc:alabaster/bricks/${global.MINECRAFT_DYE_NAMES[i]}`)
            .duration(20)
            .EUt(7)
    }
    
    // Raw Alabaster
    event.recipes.gtceu.chemical_bath('tfc:alabaster/raw/poor_raw_gypsum')             
        .itemInputs('gtceu:poor_raw_gypsum')
        .inputFluids(Fluid.of('tfc:limewater', 50))
        .itemOutputs('tfc:alabaster/raw')
        .duration(400)
        .EUt(2)

    event.recipes.gtceu.chemical_bath('tfc:alabaster/raw/raw_gypsum')             
        .itemInputs('gtceu:raw_gypsum')
        .inputFluids(Fluid.of('tfc:limewater', 100))
        .itemOutputs('2x tfc:alabaster/raw')
        .duration(400)
        .EUt(2) 
    
    event.recipes.gtceu.chemical_bath('tfc:alabaster/raw/rich_raw_gypsum')             
        .itemInputs('gtceu:rich_raw_gypsum')
        .inputFluids(Fluid.of('tfc:limewater', 150))
        .itemOutputs('3x tfc:alabaster/raw')
        .duration(400)
        .EUt(2)

    event.recipes.gtceu.chemical_bath('tfc:alabaster/raw')             
        .itemInputs('#tfc:colored_bricks_alabaster')
        .inputFluids(Fluid.of('gtceu:chlorine', 72))
        .itemOutputs('tfc:alabaster/raw')
        .duration(400)
        .EUt(2)
    
    for (let i = 0; i < 16; i++) {
    event.recipes.gtceu.chemical_bath(`tfg:tfc/alabaster/raw/${global.MINECRAFT_DYE_NAMES[i]}`)             
        .itemInputs('tfc:alabaster/raw')
        .inputFluids(Fluid.of(`gtceu:${global.MINECRAFT_DYE_NAMES[i]}_dye`, 72))
        .itemOutputs(`tfc:alabaster/raw/${global.MINECRAFT_DYE_NAMES[i]}`)
        .duration(20)
        .EUt(7)
    }
    
    //#endregion
}
