<script>
    // @ts-nocheck
    export let data;
    import { fade } from "svelte/transition"
    import { format } from "d3-format"
    const suffixFormat = (d) => format(".2s")(d).replace("G", "B") 

    // $: console.log(data)
</script>

{#key data}
    <div class="tooltip" in:fade>
        <h2>{data.country}</h2>
        <h3>Population: {suffixFormat(data.population)}</h3>
    </div>
{/key}

<style>
    .tooltip {
        position: absolute;
        right:0;
        top: calc(800px - 100px)
    }

    .tooltip h2 {
        font-size: 40px;
        margin-bottom: 5px;
        margin-top: 0;
        color: #fff;
        font-weight: 600;
    }

    .tooltip h3 {
        font-size: 25px;
        margin-top: 0;
        font-weight: 300;
        color: rgba(255, 255, 255, 0.4)
    }
</style>