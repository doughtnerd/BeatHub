<script>
  import BeatmapStat from "./BeatmapStat.svelte";
  import { tooltip } from "../actions/tooltip";
  import { key } from "svelte-awesome/icons";
</script>

<div use:tooltip={{ text: 'Id', position: 'left' }}>
  <BeatmapStat icon={key} iconColor="var(--beatmapKeyIconColor)">
    <slot />
  </BeatmapStat>
</div>
