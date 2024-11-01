<script>
    // @ts-nocheck
    import { json, tsv, geoAlbersUsa, zoom, select, zoomIdentity, pointer, scaleThreshold, schemePurples, schemeGnBu, range } from "d3"
    import { geoPath} from "d3-geo"
    import * as topojson from "topojson-client";
	import { onMount } from "svelte";

    let width = 800, height = width;

    const rawCountiesPath = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json'
    const dataTsvPath = 'https://gist.githubusercontent.com/mbostock/4060606/raw/e68fa0d5a2b24cfdad54168599705f346dc74ae2/unemployment.tsv'

    let geojson;
    let unemploymentData;

    
    // json(jsonPath).then((data) => geojson = data)
    json(rawCountiesPath).then((data) => geojson = data)
    tsv(dataTsvPath).then((data) => unemploymentData = data)
    
    $: projection = geoAlbersUsa().translate([width / 2, height / 2]);
    let pathGenerator = geoPath() /** Don't pass projection */

    let colorScale = scaleThreshold()
        .domain(range(2, 10))
        .range(schemeGnBu[7])

    /** Generate paths for county data */
    let USCounties = []
    let bordersPath;
    $: if(geojson && unemploymentData) {
        let counties = topojson.feature(geojson, geojson.objects.counties).features 
        let states = topojson.feature(geojson, geojson.objects.states).features 
        bordersPath = topojson.mesh(geojson, geojson.objects.states, (a,b) => a!==b)

        // console.log(counties, states)

        USCounties = counties.map((county) => {
            const stateIdentifier = county.id.slice(0, 2)
            const state = states.find((state) => state.id === stateIdentifier)
            
            return {
                ...county,
                path: pathGenerator(county),
                state: state.properties.name,
                unemploymentRate: unemploymentData.find((data) => {
                    if(data.id === county.id){
                        return data.rate
                    }
                })
            }
        })
    }

    let hoveredCountyId = null
    let map;
    let mapGroup;
    let selectedMapElement;

    let gTransform = {x: 0, y: 0, k: 1}, gStrokeWidth;
    let clickedCounty = null

    const zoomTransform = zoom()
        .scaleExtent([1, 8])
        .on("zoom", zoomed)

    function zoomed(evt){
        const { transform } = evt

        gTransform = transform;
        gStrokeWidth = 1 / transform.k;
    }

    function handleZoom(e, county){
        e.stopPropagation();
        const [ [x0, y0], [x1, y1] ] = pathGenerator.bounds(county)

        clickedCounty = county

        selectedMapElement.transition().duration(750).call(
            zoomTransform.transform,            
            zoomIdentity
                .translate(width / 2, height / 2)
                .scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            pointer(e, map)
        )
    }

    onMount(() => {
        selectedMapElement = select(map)
        selectedMapElement.call(zoomTransform)
    })
</script>


<div class="wrapper">
    <div class="chart-details">
        {#if clickedCounty}
            <h1>{clickedCounty.properties.name}</h1>
            <h2>State: {clickedCounty.state}</h2>
            <h2>Unemployment rate: {clickedCounty.unemploymentRate.rate}</h2>
        {:else}
            <h1>Select a county to see related data</h1>
        {/if}
    </div>
    <svg {width} {height} viewBox="0, 0, {width}, {height}" bind:this={map}>
        <!-- Counties -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <g bind:this={mapGroup} transform="translate({gTransform.x}, {gTransform.y}) scale({gTransform.k})" stroke-width={gStrokeWidth} >
            {#each USCounties as county}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <path
                    d={county.path}
                    fill={county.unemploymentRate === undefined ? 'darkgrey' : colorScale(county.unemploymentRate.rate)}
                    on:mouseenter={() => hoveredCountyId = county.id}
                    on:click={(e) => handleZoom(e, county)}
                    class:active={hoveredCountyId === county.id}
                    class:clicked={clickedCounty && clickedCounty.id === county.id}
                />
            {/each}
            <path class="border" d={pathGenerator(bordersPath)} fill="none" stroke="white" stroke-width="1"/>
        </g>
        <!---Borders-->
    </svg>
</div>

<style>
    .wrapper {
        /* width: 100vw;
        height: 100vh; */
        overflow: hidden;
        display: flex;
    }

    .chart-details {
        flex: 1 0 calc(20% - 30px);
        padding: 30px 0 30px 30px;
        margin-right: 30px;
    }

    .chart-details h1 {
        font-size: 26px;
        text-align: left;
    }

    svg {
        flex: 1 0 80%
    }

    path:not(.border) {
        stroke: none;
    }

    path.clicked {
        opacity: 1;
        fill: rgb(11, 135, 0);
    }
    
    path.active:not(.clicked) {
        opacity: 0.7;
        fill: rgb(22, 97, 208)
    }
</style>