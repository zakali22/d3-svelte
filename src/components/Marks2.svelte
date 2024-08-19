<script lang="ts">
    import { fly, fade } from "svelte/transition";
    import { curveNatural, line } from "d3";
    export let dataset;
    export let xScale;
    export let yScale;
  
    $: line_gen = line()
      .curve(curveNatural)
      .x((d: any) => xScale(d.timestamp))
      .y((d: any) => yScale(d.temperature))(dataset);
  </script>
  
  <path d={line_gen} />
  {#each dataset as data, i}
    <circle
      cx={xScale(data.timestamp)}
      cy={yScale(data.temperature)}
      r="3"
      in:fly={{ duration: 8500, delay: i * 20 }}
    />
  {/each}
  
  <style>
    circle {
      fill: #137880;
    }
    path {
      fill: transparent;
      stroke: rgb(8, 250, 137);
      stroke-width: 2.5;
      stroke-linejoin: round;
      stroke-dasharray: 4400;
      stroke-dashoffset: 0;
      animation: dash 8.5s ease-in-out;
    }
    @keyframes dash {
      from {
        stroke-dashoffset: 4400;
      }
      to {
        stroke-dashoffset: 0;
      }
    }
  </style>