<script>
    import { fly } from "svelte/transition";
    export let xScale;
    export let innerHeight;
    export let tickFormat;
</script>
  
{#each xScale.ticks() as tick, i}
    <g transform={`translate(${xScale(tick)},${0})`}>
      <line y2={innerHeight} in:fly={{ duration: 500 * i }} />
      <text y={innerHeight + 3} dy="0.8em">{tickFormat(tick)}</text>
    </g>
{/each}
  
<style>
    line {
      stroke: #c8c8bb;
    }
    text {
      fill: rgb(71, 68, 65);
      text-anchor: middle;
      font-family: "Montserrat", sans-serif;
    }
</style>