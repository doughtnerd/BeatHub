<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { percent } from "svelte-awesome/icons";

  export let percentage;

  $: textVal = Math.round(percentage * 100);
</script>

<BeatmapStat icon={percent} iconColor="var(--beatmapRatingIconColor)">
  <span>{textVal}</span>
</BeatmapStat>
