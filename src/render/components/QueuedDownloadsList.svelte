<script>
  import DownloadsListItem from "./DownloadsListItem.svelte";
  import { queuedBeatmaps } from "../stores/downloads.store";
</script>

<style>
  .list {
    display: flex;
    flex-direction: column;

    padding: 16px;
  }
</style>

<h1>Queued</h1>
{#each $queuedBeatmaps as item}
  <div class="list">
    <DownloadsListItem beatmap={item.beatmap} isDownloading={true} />
  </div>
{/each}
