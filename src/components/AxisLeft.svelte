<script>
    export let yScale;
</script>
  
{#each yScale.domain() as tick, i}
    <text x="-3" y={yScale(tick) + yScale.bandwidth() / 2} dy="0.32em">{tick}</text>
{/each}
  
<style>
    text {
        text-anchor: end;
        fill: rgb(71, 68, 65);
        font-family: "Montserrat", sans-serif;
    }
</style>