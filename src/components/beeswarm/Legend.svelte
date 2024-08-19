<script>
// @ts-nocheck
    import { createEventDispatcher } from "svelte"
    export let colorScale;
    export let highlightedContinent

    const dispatch = createEventDispatcher()

    $: continents = colorScale.domain()
    $: continentHighlighted = highlightedContinent

    $: console.log(continentHighlighted)

    function handleLegendHighlight(continent){
        dispatch('handleLegendHighlight', { continent })
    }
</script>

<div class="legend">
    {#each continents as continent}
        <div 
            class="legend-item"
            class:unhighlighted={continentHighlighted && (continentHighlighted !== continent)} 
            role="presentation" 
            on:mouseover={() => handleLegendHighlight(continent)} 
            on:focus={() => handleLegendHighlight(continent)}
            on:mouseleave={() => handleLegendHighlight(null)}
            on:click={(e) => e.stopPropagation()}
        >
                <p>
                    <span style="background: {colorScale(continent)}" />
                    {continent}
                </p>
        </div>
    {/each}
</div>

<style>
    .legend {
      display: flex;
      place-items: center;
      justify-content: center;
      flex-direction: row;
      flex-wrap: wrap;
      row-gap: 5px;
      margin-bottom: 0.25rem;
      transition: opacity 300ms ease;
    }

    .legend-item {
        padding-right: 15px
    }
  
    p {
      margin: 0;
      font-size: 0.8rem;
      text-transform: uppercase;
      cursor: pointer;
      transition: opacity 300ms ease;
      display: flex;
      place-items: center;
      column-gap: 3px;
    }

    div.unhighlighted {
        opacity: 0.2
    }

    span {
      width: 9px;
      height: 9px;
      display: inline-block;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.5);
    }
</style>