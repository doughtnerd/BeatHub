<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { thumbsUp } from "svelte-awesome/icons";

  export let count;

  $: textVal = count.toLocaleString();
</script>

<BeatmapStat icon={thumbsUp} iconColor="var(--beatmapUpvotesIconColor)">
  <span>{textVal}</span>
</BeatmapStat>
