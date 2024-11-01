<script>
    export let colorScale;
    export let data;

    import { spring } from "svelte/motion"

    const markerPos = spring(0, { stiffness: 0.1, damping: 0.8 });
    const totalPopulation = colorScale.domain()[1]

    $: if(data && data.country) {
        $markerPos = (data.population / totalPopulation) * 100
        // console.log($markerPos)
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
        top: calc(800px + 15px);
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 1200px;
    }

    .legend-scale__wrapper {
        display: flex;
        align-items: center;
    }

    .legend-scale__wrapper p {
        color: rgba(255, 255, 255, 0.7);
        font-size: 18px;
        font-weight: 300;
    }

    .legend-scale__wrapper div {
        position: relative;
        width: 100%;
        height: 28px;
        margin: 0 7px;
    }

    .legend-scale__wrapper div span {
        position: absolute;
        width: 1px;
        height: 100%;
        background-color: #fff;
    }
</style>