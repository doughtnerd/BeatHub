<script>
  import Upvotes from "./Upvotes.svelte";
  import Downvotes from "./Downvotes.svelte";
  import BeatmapKey from "./BeatmapKey.svelte";
  import Downloads from "./Downloads.svelte";
  import Rating from "./Rating.svelte";

  export let beatmap;
</script>

<style>
  .beatmap-stats {
    display: flex;
    flex-direction: column;
    text-align: right;
    font-weight: lighter;
    overflow: hidden;
  }
</style>

<div class="beatmap-stats">
  <BeatmapKey>{beatmap.key}</BeatmapKey>
  <Upvotes count={beatmap.stats.upVotes} />
  <Downvotes count={beatmap.stats.downVotes} />
  <Downloads>{beatmap.stats.downloads}</Downloads>
  <Rating percentage={beatmap.stats.rating} />
</div>
