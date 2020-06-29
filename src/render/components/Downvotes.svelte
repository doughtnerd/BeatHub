<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { thumbsDown } from "svelte-awesome/icons";
  import { tooltip } from "../actions/tooltip";
  export let count;

  $: textVal = count.toLocaleString();
</script>

<div use:tooltip={{ text: 'Downvotes', position: 'left' }}>
  <BeatmapStat icon={thumbsDown} iconColor="var(--beatmapDownvotesIconColor)">
    <span>{textVal}</span>
  </BeatmapStat>

</div>
