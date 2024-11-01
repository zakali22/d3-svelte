<script>
    // @ts-nocheck
    import world from "../../data/geodata.json";
    import populationData from "../../data/population-data.json";
    import * as topojson from "topojson-client";
    import { zoomIdentity } from "d3"
    import { geoPath, geoMercator } from "d3-geo"
    import { scaleLinear } from "d3-scale"
    import { max } from "d3-array"
    import Glow from "../../components/geo/Glow.svelte"
    import { zoom } from "d3-zoom"
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
    let width = 2000, height = 800
    $: projection = geoMercator()
        .scale(1200 / 5)
        .translate([2000 / 2, 500])

    /** Path function to convert coord into svg path */
    $: path = geoPath(projection)


    /** Color scale for population */
    const colorScale = scaleLinear()
        .domain([0, max(populationData, d => d.population)])
        .range(["#E9D99F", "#9D2020"]);


    let isDragging = false;
    let tooltipData = null;

    /** Zoom */
    let globe;
    $:  {
        const element = select(globe)
        element.call(
            zoom().on("zoom", (evt) => {
                const { x, y, k } = evt.transform

                

                console.log(x, y, k)
            })
        )
    }
    
</script>

<div class="wrapper">
    <div class="chart-title">
        <h1>The World at a Glance</h1>
        <h2>Population by Country, 2021</h2>
    </div>

    <div class="chart-container" bind:clientWidth={width}>

        <svg {width} {height} bind:this={globe}>
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
                        stroke="red"
                        stroke-width="2"
                    />
                {/key}
            {/if}
        </svg>

        {#if tooltipData && tooltipData.country}
            <Tooltip data={tooltipData} />
        {/if}

        <Legend {colorScale} data={tooltipData}  />
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
        color: #000;
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
        /* max-width: 800px; */
    }

    .chart-container svg {
        /* overflow: visible; */
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: calc(100vh - 48px);
        background: #fff;
        position: absolute;
        right: 0;
        left: 0;
        top: 48px;
    }

    path.country {
        cursor: pointer;
    }

    path:focus {
        outline: none;
    }

</style>