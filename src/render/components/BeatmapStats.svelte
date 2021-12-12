<script>
  import Upvotes from "./Upvotes.svelte";
  import Downvotes from "./Downvotes.svelte";
  import BeatmapKey from "./BeatmapKey.svelte";
  import Downloads from "./Downloads.svelte";
  import Rating from "./Rating.svelte";

  export let beatmap;
</script>

<div class="beatmap-stats">
  <BeatmapKey>{beatmap.id}</BeatmapKey>
  <Upvotes count={beatmap.stats.upvotes} />
  <Downvotes count={beatmap.stats.downvotes} />
  <!-- <Downloads count={beatmap.stats.downloads} /> -->
  <Rating percentage={beatmap.stats.score} />
</div>

<style>
  .beatmap-stats {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-weight: lighter;
    overflow: hidden;
  }
</style>
