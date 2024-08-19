<svelte:head>
	<title>Scatterplot</title>
	<meta name="description" content="Scatterplot" />
</svelte:head>


<script lang="ts">
  import data from "../../data/student-data"
  import { scaleLinear } from "d3-scale"
  import { max } from "d3-array"
	import AxisX from "../../components/scatterplot/AxisX.svelte";
	import AxisY from "../../components/scatterplot/AxisY.svelte";
	import Tooltip from "../../components/scatterplot/Tooltip.svelte";
  import { fly } from "svelte/transition"
	import { sort } from "d3-array";
	import { onMount } from "svelte";

  type Data = { name: string, hours: number, grade: number }
  
  let width = 400; 
  let height = 400;
  let margin = {top: 25, right: 20, bottom: 20, left: 0}
  let radius = 10

  $: innerWidth = width - margin.left - margin.right
  let innerHeight = height - margin.top - margin.bottom

  /** Setup D3 scaling */
  $: xScale = scaleLinear().domain([0, max(data, (d: Data) => d.grade)]).range([0, innerWidth])
  let yScale = scaleLinear().domain([0, max(data, (d: Data) => d.hours)]).range([innerHeight, 0])

  let tooltipData: Data | null = null;
  let mountCircles = false

  function handleTooltip(data: Data | null){
    tooltipData = data
  }

  onMount(() => {
    setTimeout(() => {
      mountCircles = true
    }, 100)
  })
  
</script>

<h1>Students who studied longer scored higher on their final exams</h1>
<div bind:clientWidth={width}> <!-- Changes the width variable based on screen size -->
  <svg {width} {height} on:mouseleave={() => handleTooltip(null)} role="presentation">
    <g transform={`translate(0, ${margin.top})`}>
      <AxisX width={innerWidth} height={innerHeight} {xScale} {yScale} /> 
      <AxisY width={innerWidth} height={innerHeight} {xScale} {yScale} />
      {#each data.sort((a, b) => a.grade - b.grade) as student, i}
        {#if mountCircles}
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <circle 
            in:fly={mountCircles ? {delay: 200 + i*10, opacity: 0, duration: 1000} : {}} 
            cx={xScale(student.grade)} 
            cy={yScale(student.hours)} 
            r={tooltipData === student ? radius*2 : radius} 
            fill="purple" 
            opacity={tooltipData ? (tooltipData === student ? '1' : '0.3') : 1}
            stroke="black"
            role="presentation"
            on:mouseover={() => handleTooltip(student)}
            on:focus={() => handleTooltip(student)}
            tabindex="0"
          /> 
        {/if}
      {/each}
    </g>
  </svg>

  {#if tooltipData}
    <Tooltip data={tooltipData} {xScale} {yScale} {width} />
  {/if}
</div>
<style>
  :global(.tick text, .axis-title) {
    font-weight: 400; /* How thick our text is */
    font-size: 12px; /* How big our text is */
    fill: hsla(212, 10%, 53%, 1); /* The color of our text */
  }
  
  circle {
    transition: r 300ms ease, opacity 300ms ease;
    cursor: pointer;
    transform-origin: 50% 50%;
  }

  h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
</style>