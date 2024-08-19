<script lang="ts">
    import { fly } from "svelte/transition"
    export let xScale;
    export let yScale;
    export let height;
    export let width;
    let xTicks = [0, 25, 50, 75, 100]

</script>

<g class="axis-title x">
    {#each xTicks as tick, i}
        <g class="tick" transform={`translate(${xScale(tick)}, 0)`}>
            <line x1={i === xTicks.length - 1 ? 1*-10 : 1} y1={height} x2={i === xTicks.length - 1 ? 1*-10 : 1} y2={height + 6} stroke="#2d2d2d" />
            <text x={0} y={height} dy={15} dominant-baseline="middle" text-anchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'} >{tick}%</text>
        </g>
    {/each}
</g>