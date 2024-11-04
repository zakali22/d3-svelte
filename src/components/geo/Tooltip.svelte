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
        top: calc(var(--chart-height, 600px) - 100px);
        background: var(--bg-colour, transparent);
        padding: 15px;
    }

    .tooltip h2 {
        font-size: 40px;
        margin-bottom: 5px;
        margin-top: 0;
        color: var(--font-colour, #fff);;
        font-weight: 600;
    }

    .tooltip h3 {
        font-size: 25px;
        margin-top: 0;
        font-weight: 300;
        color: var(--font-colour, #fff);
    }
</style>