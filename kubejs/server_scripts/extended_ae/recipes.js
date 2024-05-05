const registerExpatternproviderRecipes = (event) => {

    event.remove([
        { id: 'expatternprovider:ei' },
        { id: 'expatternprovider:epp' },
        { id: 'expatternprovider:ebus_in' },
        { id: 'expatternprovider:ebus_out'},
        {id: 'expatternprovider:tag_export_bus'},
        {id: 'expatternprovider:mod_export_bus'},
        {id: 'expatternprovider:pre_bus'},
        {id: 'expatternprovider:caner'},
        {id: ''},

    ]);
    

    //#region Ext interface

    // IV
    event.recipes.gtceu.assembly_line('expatternprovider:ex_interface_iv')
        .itemInputs(
            '2x #megacells:mega_interface',
            '4x megacells:accumulation_processor',
            '4x gtceu:iv_conveyor_module',
            'gtceu:fusion_glass',
            '2x #forge:dense_plates/tungsten_steel',
            '#gtceu:circuits/iv',
            '2x #gtceu:circuits/ev',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('expatternprovider:ex_interface')
        .duration(300)
        .EUt(7680)
        .cleanroom(CleanroomType.CLEANROOM)

    // LuV
    event.recipes.gtceu.assembly_line('expatternprovider:ex_interface_luv')
        .itemInputs(
            '4x #megacells:mega_interface',
            '4x megacells:accumulation_processor',
            '4x gtceu:luv_conveyor_module',
            '2x gtceu:fusion_glass',
            '2x #forge:dense_plates/rhodium_plated_palladium',
            '#gtceu:circuits/luv',
            '2x #gtceu:circuits/iv',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('2x expatternprovider:ex_interface')
        .duration(300)
        .EUt(30720)
        .cleanroom(CleanroomType.CLEANROOM)

    // ZPM
    event.recipes.gtceu.assembly_line('expatternprovider:ex_interface_zpm')
        .itemInputs(
            '8x #megacells:mega_interface',
            '4x megacells:accumulation_processor',
            '4x gtceu:zpm_conveyor_module',
            '4x gtceu:fusion_glass',
            '2x #forge:dense_plates/naquadah_alloy',
            '#gtceu:circuits/zpm',
            '2x #gtceu:circuits/luv',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('4x expatternprovider:ex_interface')
        .duration(300)
        .EUt(119680)
        .cleanroom(CleanroomType.CLEANROOM)

    // UV
    event.recipes.gtceu.assembly_line('expatternprovider:ex_interface_ev')
        .itemInputs(
            '16x #megacells:mega_interface',
            '4x megacells:accumulation_processor',
            '4x gtceu:uv_conveyor_module',
            '8x gtceu:fusion_glass',
            '4x #forge:dense_plates/darmstadtium',
            '#gtceu:circuits/uv',
            '2x #gtceu:circuits/zpm',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('8x expatternprovider:ex_interface')
        .duration(300)
        .EUt(491520)
        .cleanroom(CleanroomType.CLEANROOM)
    //#endregion

    //#region ex pattern provider 
    // IV
    event.recipes.gtceu.assembly_line('expatternprovider:ex_pattern_provider_iv')
        .itemInputs(
            '2x #megacells:mega_pattern_provider',
            '4x megacells:accumulation_processor',
            '4x gtceu:iv_conveyor_module',
            '2x #forge:dense_plates/tungsten_steel',
            '#gtceu:circuits/iv',
            '2x #gtceu:circuits/ev',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('expatternprovider:ex_pattern_provider')
        .duration(300)
        .EUt(7680)
        .cleanroom(CleanroomType.CLEANROOM)

    // LuV
    event.recipes.gtceu.assembly_line('expatternprovider:ex_pattern_provider_luv')
        .itemInputs(
            '4x #megacells:mega_pattern_provider',
            '4x megacells:accumulation_processor',
            '4x gtceu:luv_conveyor_module',
            '2x #forge:dense_plates/rhodium_plated_palladium',
            '#gtceu:circuits/luv',
            '2x #gtceu:circuits/iv',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('2x expatternprovider:ex_pattern_provider')
        .duration(300)
        .EUt(30720)
        .cleanroom(CleanroomType.CLEANROOM)

    // ZPM
    event.recipes.gtceu.assembly_line('expatternprovider:ex_pattern_provider_zpm')
        .itemInputs(
        '8x #megacells:mega_pattern_provider',
        '4x megacells:accumulation_processor',
        '4x gtceu:zpm_conveyor_module',
        '2x #forge:dense_plates/naquadah_alloy',
        '#gtceu:circuits/zpm',
        '2x #gtceu:circuits/luv',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('4x expatternprovider:ex_pattern_provider')
        .duration(300)
        .EUt(119680)
        .cleanroom(CleanroomType.CLEANROOM)
        
    //UV
    event.recipes.gtceu.assembly_line('expatternprovider:ex_pattern_provider_uv')
        .itemInputs(
            '16x #megacells:mega_pattern_provider',
            '4x megacells:accumulation_processor',
            '4x gtceu:uv_conveyor_module',
            '2x #forge:dense_plates/darmstadtium',
            '#gtceu:circuits/uv',
            '2x #gtceu:circuits/zpm',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 1152))
        .itemOutputs('8x expatternprovider:ex_pattern_provider')
        .duration(300)
        .EUt(491520)
        .cleanroom(CleanroomType.CLEANROOM)

    //#endregion

    //#region bus

    //ex import bus part
    event.recipes.gtceu.assembly_line('expatternprovider:ex_import_bus_part')
        .itemInputs(
            '2x #forge:plates/tungsten_steel',
            '8x ae2:calculation_processor',
            '4x megacells:accumulation_processor',
            '4x ae2:annihilation_core',
            '2x ae2:import_bus',
            '2x gtceu:iv_conveyor_module',
            '2x gtceu:iv_electric_pump',
            'gtceu:iv_robot_arm',
            '4x #forge:rods/tungsten_steel',
            '8x #forge:bolts/tungsten_steel',
            '4x ae2:speed_card',)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 144))
        .itemOutputs('expatternprovider:ex_import_bus_part')
        .duration(200)
        .EUt(7680)
        .cleanroom(CleanroomType.CLEANROOM)

    //ex export bus part
    event.recipes.gtceu.assembly_line('expatternprovider:ex_export_bus_part')
        .itemInputs(
        '2x #forge:plates/tungsten_steel',
        '8x ae2:calculation_processor',
        '4x megacells:accumulation_processor',
        '4x ae2:formation_core',
        '2x ae2:export_bus',
        '2x gtceu:iv_conveyor_module',
        '2x gtceu:iv_electric_pump',
        'gtceu:iv_robot_arm',
        '4x #forge:rods/tungsten_steel',
        '8x #forge:bolts/tungsten_steel',
        '4x ae2:speed_card',)
    .inputFluids(Fluid.of('gtceu:polybenzimidazole', 144))
    .itemOutputs('expatternprovider:ex_export_bus_part')
    .duration(200)
    .EUt(7680)
    .cleanroom(CleanroomType.CLEANROOM)

    //tag export bus
    event.recipes.gtceu.assembler('expatternprovider:tag_export_bus')
        .itemInputs(
            'expatternprovider:ex_export_bus_part',
            '2x ae2:logic_processor',
            'gtceu:digital_interface_cover',)
        .itemOutputs('expatternprovider:tag_export_bus')
        .duration(100)
        .EUt(480)

    //mod export bus
    event.recipes.gtceu.assembler('expatternprovider:mod_export_bus')
        .itemInputs(
            'expatternprovider:ex_export_bus_part',
            '2x ae2:calculation_processor',
            'gtceu:digital_interface_cover',)
        .itemOutputs('expatternprovider:mod_export_bus')
        .duration(100)
        .EUt(480)

    //precise export bus
    event.recipes.gtceu.assembler('expatternprovider:precise_export_bus')
        .itemInputs(
            'expatternprovider:ex_export_bus_part',
            '2x ae2:calculation_processor',)
        .itemOutputs('expatternprovider:precise_export_bus')
        .duration(100)
        .EUt(480)

    //#endregion

    event.recipes.gtceu.assembler('expatternprovider:caner')
        .itemInputs(
            'expatternprovider:ingredient_buffer',
            'expatternprovider:ex_import_bus_part',
            'expatternprovider:ex_export_bus_part',
            '2x ae2:calculation_processor',
    )
        .itemOutputs('expatternprovider:caner')
        .duration(100)
        .EUt(480)
}