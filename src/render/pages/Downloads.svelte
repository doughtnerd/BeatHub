<script>
  import DownloadsListItem from "../components/DownloadsListItem.svelte";
  import { downloads } from "../stores/downloads.store";

  $: queuedBeatmaps = Object.values($downloads.downloading);
  $: downloadedBeatmaps = Object.values($downloads.completed);
</script>

<style>
  .downloads-container {
    padding-left: 16px;
    padding-right: 16px;
    overflow-y: scroll;
  }

  .downloads-container::-webkit-scrollbar {
    background-color: var(--foreground);
  }

  .downloads-container::-webkit-scrollbar-thumb:window-inactive,
  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(
      to bottom,
      var(--scrollbarPrimaryColor),
      var(--scrollbarSecondaryColor)
    );
    border: 2px solid var(--background);
  }

  .list {
    display: flex;
    flex-direction: column;

    padding: 16px;
  }
</style>

<div class="downloads-container">

  <h1>Queued</h1>
  {#each queuedBeatmaps as item}
    <div class="list">
      <DownloadsListItem beatmap={item.beatmap} isDownloading={true} />
    </div>
  {/each}

  <h1>Completed</h1>
  {#each downloadedBeatmaps as item}
    <div class="list">
      <DownloadsListItem beatmap={item} isDownloading={false} />
    </div>
  {/each}

</div>
