<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { thumbsDown } from "svelte-awesome/icons";

  export let count;

  $: textVal = count.toLocaleString();
</script>

<BeatmapStat icon={thumbsDown} iconColor="var(--beatmapDownvotesIconColor)">
  <span>{textVal}</span>
</BeatmapStat>
