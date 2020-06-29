<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { tooltip } from "../actions/tooltip";
  import { download } from "svelte-awesome/icons";

  export let count;

  $: textVal = count.toLocaleString();
</script>

<div use:tooltip={{ text: 'Downloads', position: 'left' }}>
  <BeatmapStat icon={download} iconColor="var(--beatmapDownloadsIconColor)">
    <span>{textVal}</span>
  </BeatmapStat>
</div>
