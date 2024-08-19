<script>
// @ts-nocheck

    import happinessData from "../../data/happiness-data";
    import { forceSimulation, forceX, forceY, forceCollide } from "d3-force"
    import { scaleLinear, scaleBand, scaleOrdinal, scaleSqrt } from "d3-scale"
    import { extent, rollups, mean } from "d3-array"
	import AxisX from "../../components/beeswarm/AxisX.svelte";
	import AxisY from "../../components/beeswarm/AxisY.svelte";
	import Tooltip from "../../components/beeswarm/Tooltip.svelte";
    import Legend from "../../components/beeswarm/Legend.svelte";
    import { fade } from "svelte/transition"
	import { group } from "d3-array";

    let width = 400, height = 400;
    let margin = { top: 0, right: 0, bottom: 20, left: 0 }
    let innerHeight = height - margin.top - margin.bottom
    $: innerWidth = width - margin.right - margin.left

    /** Transform/sort data */
    // Sort continents based on highest happiness index
    let continents = rollups(
            happinessData, 
            (v) => mean(v, (d) => d.happiness), 
            (d) => d.continent
        )
        .sort((a, b) => a[1] - b[1])
        .map((d) => d[0])

    /** Axis scales */
    $: xScale = scaleLinear().domain([1, 9]).range([0, innerWidth])
    let yScale = scaleBand().domain(continents).range([innerHeight, 0]).paddingOuter(0.5)

    /** Color scale */
    const colorRange = [ "#dda0dd", "#fe7f2d", "#fcca46", "#a1c181", "#619b8a", "#eae2b7" ];
    let colorScale = scaleOrdinal().domain(continents).range(colorRange)

    /** Radius scale */
    $: radiusScale = scaleSqrt().domain([1, 9]).range(width > 600 ? [3, 8] : [2, 5])

    /** Simulation */
    let groupedByContinent = false
    let simulation = forceSimulation(happinessData)
    let nodes = []
    simulation.on('tick', () => {
        nodes = simulation.nodes()
    })

    $: {
        simulation
            .force('x', forceX().x((d) => xScale(d.happiness)).strength(0.8))
            .force('y', forceY().y((d) => groupedByContinent ? yScale(d.continent) : innerHeight / 2).strength(0.2))
            .force('collide', forceCollide().radius((d) => radiusScale(d.happiness)))
            .alpha(0.3)
            .alphaDecay(0.005)
            .restart()
    }

    /** Tooltip */
    let tooltipData = null
    function handleTooltip(node){
        tooltipData = node
    }

    /** Legend */
    let highlightedContinent = null
    function handleLegendHighlight(event){
        // console.log(event.detail.continent)
        highlightedContinent = event.detail.continent
    }

    function resetDataSelection(){
        tooltipData = null
        highlightedContinent = null
    }
</script>

<svelte:window on:resize={resetDataSelection} />

<h1>Happiest countries in the world</h1>
<!-- Container > Legend + SVG + AxisX + AxisY > Circles + Tooltip-->
<div class="chart-container" 
    bind:clientWidth={width} 
    on:click={() => { 
        groupedByContinent = !groupedByContinent 
        resetDataSelection()
    }} 
    role="presentation"
>
    <Legend {colorScale} {xScale} {highlightedContinent} on:handleLegendHighlight={handleLegendHighlight}/>
    <svg {width} {height}>
        {#if tooltipData}
            <line 
                x1={tooltipData.x}
                y1={tooltipData.y}
                x2={tooltipData.x}
                y2={height}
                stroke={colorScale(tooltipData.continent)}
                stroke-width="3"
                in:fade={{duration: 300}}
            />
        {/if}
        <g transform="translate({margin.left}, {margin.top})" on:mouseleave={() => handleTooltip(null)} role="presentation">
            <AxisY height={innerHeight} {yScale} {groupedByContinent} />
            <AxisX height={innerHeight} width={innerWidth} {xScale} />
            {#each nodes as node, i}
                <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
                <circle 
                    cx={node.x}
                    cy={node.y}
                    r={radiusScale(node.happiness)}
                    fill={colorScale(node.continent)}
                    stroke={(tooltipData || highlightedContinent) ? (tooltipData?.country === node?.country || highlightedContinent === node.continent ? "black" : "none") : "#00000090"}
                    stroke-width="1.2"
                    role="presentation"
                    tabindex="0"
                    opacity={(tooltipData || highlightedContinent) ? (tooltipData?.country === node?.country || highlightedContinent === node.continent ? 1 : 0.2) : 1}
                    on:mouseover={() => handleTooltip(node)}
                    on:focus={() => handleTooltip(node)}
                    on:click={(e) => e.stopPropagation()}
                />
            {/each}
        </g>
    </svg>

    {#if tooltipData}
        <Tooltip data={tooltipData} {colorScale} width={innerWidth} />
    {/if}
</div>


<style>
    :global(*) {
        font-family: Inter, -apple-system, system-ui;
        -moz-osx-font-smoothing: grayscale;
    }
    :global(.tick, text){
        font-size: 12px;
        font-weight: 400;
        fill: #7b8693;
        user-select: none;
    }

    h1 {
        margin: 0 0 0.5rem 0;
        font-size: 1.35rem;
        font-weight: 600;
        text-align: center;
    }

    circle {
        transition: stroke 300ms ease, opacity 300ms ease;
        cursor: pointer;
    }

    circle:focus {
        outline: none;
    }
</style>