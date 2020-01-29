<script>
  import BeatmapStat from "./BeatmapStat.svelte";

  import { key } from "svelte-awesome/icons";
</script>

<BeatmapStat icon={key} iconColor="var(--beatmapKeyIconColor)">
  <slot />
</BeatmapStat>
