<script lang="ts">
    import { fly } from "svelte/transition"
    export let xScale;
    export let yScale;
    export let height;
    export let width;
    let yTicks = yScale.ticks(4)

</script>

<g class="axis-title y" in:fly={{}}>
    {#each yTicks as tick, i}
        <line x1={0} y1={yScale(tick)} x2={width} y2={yScale(tick)} stroke={i === 0 ? "#8f8f8f" : "#cecece"} />
        <text y={yScale(tick)} dy={-4}>{i === yTicks.length - 1 ? `${tick} hours studied` : `${tick}`}</text>
    {/each}
</g>