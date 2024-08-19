<script>
// @ts-nocheck

    export let width
    export let data;
    export let colorScale

    let yTicks = colorScale.domain()

    $: x = data.x;
    $: y = data.y;

    let tooltipWidth;
    let xNudge = 8, yNudge = 10;

    $: xPos = x + tooltipWidth + xNudge > width ? x - tooltipWidth - xNudge : x + xNudge
    $: yPos = y + yNudge

</script>

<div class="tooltip" style="top: {yPos}px; left: {xPos}px" bind:clientWidth={tooltipWidth}>
  <!-- Country name -->
  <h1>
    {data.country}
  </h1>
  <!-- Additional info under the country name -->
  <div class='info'>
    <span class="score">
        {data.happiness}/10
    </span>
    <span class="continent" style="background: {colorScale(data.continent)}">
        {data.continent}
    </span> 
  </div>
  <!-- Bar chart -->
  <span class="bar background" />
  <span class="bar foreground" 
    style="width: {data.happiness * 10}%; 
    background: {colorScale(data.continent)}" />
</div>

<style>
    .tooltip {
      position: absolute;
      padding: 8px 6px;
      background: white;
      box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 8px;
      border-radius: 3px;
      pointer-events: none;
      min-width: 130px;
      transition: top 300ms ease, left 300ms ease;
    }
  
    h1 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      margin-bottom: 3px;
    }
  
    .info {
      display: flex;
      justify-content: space-between;
      column-gap: 8px;
    }
  
    .score {
      font-size: 0.8rem;
    }
  
    .continent {
      font-size: 0.65rem;
      padding: 3px 4px 2px 4px;
      border-radius: 3px;
      text-transform: uppercase;
      white-space: nowrap;
    }
  
    .bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      width: 100%;
    }
  
    .bar.background {
      background: #eee;
    }
  </style>