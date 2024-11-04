<script>
    export let colorScale;
    export let data;

    import populationData from "../../data/population-data.json";
    import { spring } from "svelte/motion"
    import { max } from "d3-array"

    const markerPos = spring(0, { stiffness: 0.1, damping: 0.8 });
    // @ts-ignore
    const totalPopulation = max(populationData, (d) => d.population)

   // @ts-ignore
     $: if(data && data.country) {
        $markerPos = (data.population / totalPopulation) * 100
        console.log((data.population / totalPopulation) * 100)
    }
</script>

{#key data}
    <div class="legend-scale">
        <div class="legend-scale__wrapper">
            <p>0</p>
            <div style={`background: linear-gradient(to right, ${colorScale.range()[0]}, ${colorScale.range()[1]});`}>
                {#if $markerPos > 0}
                    <span style={`left: ${$markerPos}%`}></span>
                {/if}
            </div>
            <p>1.4B</p>
        </div>
    </div>
{/key}


<style>
    .legend-scale {
        position: absolute;
        top: calc(var(--chart-height, 600px) + 15px);
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 1200px;
    }

    .legend-scale__wrapper {
        display: flex;
        align-items: flex-end;
    }

    .legend-scale__wrapper p {
        color: var(--font-colour, #fff);
        font-size: 18px;
        font-weight: 300;
        margin: 0;
    }

    .legend-scale__wrapper div {
        position: relative;
        width: 100%;
        height: 20px;
        margin: 0 7px;
    }

    .legend-scale__wrapper div span {
        position: absolute;
        width: 3px;
        height: 100%;
        background-color: var(--font-colour, #fff);
    }
</style>