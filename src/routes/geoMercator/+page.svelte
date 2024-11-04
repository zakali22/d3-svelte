<script>
    // @ts-nocheck
    import world from "../../data/geodata.json";
    import populationData from "../../data/population-data.json";
    import * as topojson from "topojson-client";
    import { zoomIdentity, scaleThreshold, range, scaleSequential, schemeYlOrRd, interpolateYlOrRd, format, pointer } from "d3"
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
    let width = 1500, height = width / 2
    $: projection = geoMercator().scale(width / 8).translate([width / 2, height / 1.4])

    /** Path function to convert coord into svg path */
    $: path = geoPath(projection)


    /** Color scale for population */
    const colorScale = scaleThreshold()
        .domain([
            max(populationData, (d) => d.population * 0.0212), /** 30M */
            max(populationData, (d) => d.population * 0.0424), /** 60M */
            max(populationData, (d) => d.population * 0.07092), /** 100M */
            max(populationData, (d) => d.population * 0.5) /** 700M */
        ])
        .range(schemeYlOrRd[5]);

    const legendScale = scaleSequential(interpolateYlOrRd)

    let isDragging = false;

    let globe;
    let selectedGlobe;
    let gTransform = {x: 0, y: 0, k: 1}, gStrokeWidth;

    let clickedCountryData = null

    const zoomTransform = zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed)

    function zoomed(evt){
        const { transform } = evt

        gTransform = transform;
        gStrokeWidth = 1 / transform.k;
    }
    
    function handleZoom(e, country){
        const [ [x0, y0], [x1, y1] ] = path.bounds(country)

        clickedCountryData = country

        selectedGlobe.transition().duration(750).call(
            zoomTransform.transform,            
            zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            pointer(e, globe)
        )

        console.log(clickedCountryData)
    }

    onMount(() => {
        selectedGlobe = select(globe)
        selectedGlobe.call(zoomTransform)
    })
    
</script>

<div class="wrapper">
    <div class="chart-title">
        <h1>The World at a Glance</h1>
        <h2>Population by Country, 2021</h2>
    </div>

    <div class="chart-container" bind:clientWidth={width} clientHeight={height}>

        <svg {width} {height} viewBox="0, 0, {width}, {height}"  bind:this={globe}>
            <!-- Countries -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <g transform="translate({gTransform.x}, {gTransform.y}) scale({gTransform.k})">
                {#each countries.sort((a,b) => b.population - a.population) as country}
                    <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                    <!-- {console.log(country)} -->
                    <path 
                        class="country"
                        d={path(country)} 
                        fill={colorScale(country?.population || 0)} 
                        stroke="#000" 
                        stroke-width="1"
                        on:click={(e) => {
                            handleZoom(e, country)
                        }}
                        tabindex="0"
                    />
                {/each}

                <!-- Borders -->
                <path d={path(borders)} fill="none" stroke="#000" />

                <!-- Selected country highlight -->
                {#if clickedCountryData}
                    {#key clickedCountryData.id}
                        <path 
                            d={path(clickedCountryData)}
                            fill="transparent"
                            stroke="#000"
                            stroke-width="2"
                        />
                    {/key}
                {/if}
            </g>
        </svg>

        {#if clickedCountryData && clickedCountryData.country}
            <Tooltip --chart-height="800px" --font-colour="#000" --bg-colour="#fff" data={clickedCountryData} />
        {/if}

        <Legend --chart-height="800px" --font-colour="#000" colorScale={legendScale} data={clickedCountryData}  />
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