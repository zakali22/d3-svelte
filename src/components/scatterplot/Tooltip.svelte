<script lang="ts">
  export let data;
  export let width;
  export let xScale;
  export let yScale;

  $: x = xScale(data.grade)
  $: y = yScale(data.hours)

  let xNudge = 10;
  let yNudge = 20;

  let tooltipWidth: number; // Used to subtract from the scaled x position

  $: xPos = x + tooltipWidth > width ? x - tooltipWidth : (x + xNudge); // If the x scaled position + width of tooltip is greater than total width then subtract tooltip width
  $: yPos = y + yNudge
</script>


<div 
  class="tooltip" 
  style={`left: ${xPos}px; top: ${yPos}px`}
  bind:clientWidth={tooltipWidth}
>
  <!-- Set tooltip width anytime the size changes -->
  <h2>{data.name} <span>{data.grade}%</span></h2>
  <p>{data.hours} hours studied</p>
</div>

<style>
  .tooltip {
    position: absolute;
    pointer-events: none;
    background: white;
    border: 1px solid #cecece;
    padding: 10px 6px;
    box-shadow:  0 0 10px #cecece;
    transition: top 400ms ease, left 400ms ease;
  }

  .tooltip h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 100;
  }

  .tooltip h2 span {
    background: #e4a1a1b3;
    display: inline-block;
    padding: 2px 4px;
    font-size: 14px;
    font-weight: 100;
    vertical-align: middle;
  }

  .tooltip p {
    margin: 0;
    margin-top: 2px;
    font-weight: 100;
    font-size: 15px;
    text-transform: uppercase;
  }
</style>