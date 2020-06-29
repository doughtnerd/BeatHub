<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { thumbsUp } from "svelte-awesome/icons";
  import { tooltip } from "../actions/tooltip";
  export let count;

  $: textVal = count.toLocaleString();
</script>

<div use:tooltip={{ text: 'Upvotes', position: 'left' }}>
  <BeatmapStat icon={thumbsUp} iconColor="var(--beatmapUpvotesIconColor)">
    <span>{textVal}</span>
  </BeatmapStat>
</div>
