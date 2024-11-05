<script>
    // @ts-nocheck
    import world from "../../data/geodata.json";
    import populationData from "../../data/population-data.json";
    import * as topojson from "topojson-client";
    import { schemeYlOrRd } from "d3"
    import { geoOrthographic, geoPath, geoCentroid } from "d3-geo"
    import { scaleLinear } from "d3-scale"
    import { max } from "d3-array"
    import Glow from "../../components/geo/Glow.svelte"
    import { drag } from "d3-drag"
    import { select } from "d3-selection"
    import { timer } from "d3-timer"
	import { onMount } from "svelte";
    import { spring } from "svelte/motion"
    import { draw } from "svelte/transition"
	import Tooltip from "../../components/geo/Tooltip.svelte";
    import Legend from "../../components/geo/Legend.svelte";

    let countries = topojson.feature(world, world.objects.countries).features
    let borders = topojson.mesh(world, world.objects.countries, (a,b) => a!==b)

    /** Modify data to include population/country names */
    countries.forEach(country => {
        const metadata = populationData?.find(d => d.id === country.id)
        if(metadata){
            country.population = metadata.population;
            country.country = metadata.country
        }
    })

    /** Define projection */
    let width = 600, height = width
    $: projection = geoOrthographic()
        .scale(width / 2)
        .rotate([$xRotation, ($yRotation * -1)]) //x,y,z
        .translate([width / 2, height / 2]);

    /** Path function to convert coord into svg path */
    $: path = geoPath(projection)


    /** Color scale for population */
    const colorScale = scaleLinear()
        .domain([0, max(populationData, d => d.population)])
        .range(schemeYlOrRd[3]);


    /** Rotation */
    let xRotation = spring(0, { stiffness: 0.08, damping: 0.4 });
    let yRotation = spring(0, { stiffness: 0.1, damping: 0.7 })
    const degreesPerFrame = 0.3;

    const t = timer(() => {
        if(isDragging || tooltipData) return
        $xRotation += degreesPerFrame
    }, 0)

    /** Drag */
    let globe;
    let DRAG_SENSITIVITY = 0.4;
    let isDragging = false;
    
    
    onMount(() => {
        const element = select(globe)
        element.call(
            drag()
                .on("drag", (evt) => {
                    isDragging = true
                    $xRotation = $xRotation + evt.dx * DRAG_SENSITIVITY
                    $yRotation = $yRotation + evt.dy * DRAG_SENSITIVITY
                })
                .on("end", () => isDragging = false)
        )
    })

    let tooltipData = null;
    
    /** Rotate globe to selected country */
    $: if(tooltipData){
        const center = geoCentroid(tooltipData)
        console.log(center)
        $xRotation = -center[0]
        $yRotation = center[1]
    }

    let innerWidth;

    function handleResize(e){
        console.log(innerWidth)
        if(innerWidth < 800){
            return innerWidth
        }
    }
</script>

<svelte:window on:resize={handleResize} bind:innerWidth={innerWidth}/>
<div class="wrapper">
    <div class="chart-title">
        <h1>The World at a Glance</h1>
        <h2>Population by Country, 2021</h2>
    </div>

    <div class="chart-container">

        <svg preserveAspectRatio="xMidYMid slice" width={innerWidth < 800 ? innerWidth - 50 : width} {height} viewBox="0, 0, {width}, {height}" bind:this={globe} class:dragging={isDragging}>
            <!-- Glow effect -->
            <Glow />
            
            <!-- Global circle -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
            <circle 
                cx={width / 2} 
                cy={height / 2} 
                r={width / 2} 
                fill="#1c1c1c" 
                filter="url(#glow)" 
                on:click={() => {
                    tooltipData = null
                }}
                on:focus={() => {
                    tooltipData = null
                }}
                tabindex="0"
            />

            <!-- Countries -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->

            {#each countries.sort((a,b) => b.population - a.population) as country}
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <path 
                    class="country"
                    d={path(country)} 
                    fill={colorScale(country?.population || 0)} 
                    stroke="none" 
                    on:click={() => {
                        tooltipData = country
                    }}
                    on:focus={() => {
                        tooltipData = country
                    }}
                    tabindex="0"
                />
            {/each}

            <!-- Borders -->
            <path d={path(borders)} fill="none" stroke="#000" />

            <!-- Selected country highlight -->
            {#if tooltipData}
                {#key tooltipData.id}
                    <path 
                        d={path(tooltipData)}
                        fill="transparent"
                        stroke="#000"
                        stroke-width="2"
                        in:draw
                    />
                {/key}
            {/if}
        </svg>

        {#if tooltipData && tooltipData.country}
            <Tooltip data={tooltipData} />
        {/if}

        <Legend  --chart-height="innerWidth < 800 ? innerWidth : width" {colorScale} data={tooltipData}  />
    </div>
</div>

<style>
    .chart-title {
        position: absolute;
        left: 40px;
        top: 0;
    }

    .chart-title h1,
    .chart-title h2 {
        color: white;
        text-align: center;
    }

    .chart-title h1 {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 0.35rem;
    }

    .chart-title h2 {
        font-size: 1.25rem;
        font-weight: 200;
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .chart-container {
        max-width: 800px;
    }

    .chart-container svg {
        overflow: visible;
    }

    .chart-container svg.dragging {
        cursor: grabbing
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100vh - 48px);
        background: rgb(40, 40, 40);
        position: absolute;
        right: 0;
        left: 0;
        top: 48px;
    }

    path.country {
        cursor: pointer;
    }

    path:focus, circle:focus {
        outline: none;
    }

</style>