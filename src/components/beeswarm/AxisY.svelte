<script>
    import { fade } from "svelte/transition"

    export let yScale;
    export let height;
    export let groupedByContinent

    let yTicks = yScale.domain()
</script>

<g class="axis">
    {#each yTicks as tick, i}
        {#if groupedByContinent}
            <g class="tick" transform="translate(0, {yScale(tick)})" in:fade={{ delay: 100 + i*40}} out:fade>
                <text x="0" y="0">{tick}</text>
            </g>
        {/if}
    {/each}
</g>