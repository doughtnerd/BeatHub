<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { percent } from "svelte-awesome/icons";
  import { tooltip } from "../actions/tooltip";
  export let percentage;

  $: textVal = Math.round(percentage * 100);
</script>

<div use:tooltip={{ text: 'Avg. Rating', position: 'left' }}>
  <BeatmapStat icon={percent} iconColor="var(--beatmapRatingIconColor)">
    <span>{textVal}</span>
  </BeatmapStat>
</div>
