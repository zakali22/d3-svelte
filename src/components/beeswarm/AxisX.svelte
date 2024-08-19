<script>
    export let height;
    export let width;
    export let xScale

    let xTicks = [2, 4, 6, 8]
</script>

<g class="axis">
    {#each xTicks as tick, i}
        <g class="tick" transform="translate({xScale(tick)}, 0)">
            <text x="3" y={height}>{tick}</text>
            <line x1="0" x2="0" y1="0" y2={height} stroke="hsla(215, 15%, 91%, 1)" />
        </g>
    {/each}
    <text class="axis-title" x={width} y={height} dy="4" dominant-baseline="hanging" text-anchor="end">
        Happiness, out of 10 &rarr;
    </text>
</g>