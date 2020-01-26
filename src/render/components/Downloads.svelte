<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { download } from "svelte-awesome/icons";

  export let count;

  $: textVal = count.toLocaleString();
</script>

<BeatmapStat icon={download} iconColor="var(--beatmapDownloadsIconColor)">
  <span>{textVal}</span>
</BeatmapStat>
