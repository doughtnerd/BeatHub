<script>
  import { downloads, downloadedBeatmaps } from "../stores/downloads.store";

  import DownloadsListItem from "./DownloadsListItem.svelte";
  import Icon from "svelte-awesome";
  import { timesCircle } from "svelte-awesome/icons";

  function handleClearCompletedClick() {
    downloads.clearCompleted();
  }
</script>

<style>
  .list {
    display: flex;
    flex-direction: column;

    padding: 16px;
  }

  .completed-list-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .clear-button {
    color: var(--backgroundText);
  }

  .clear-button:hover {
    cursor: pointer;
    color: var(--error);
  }

  .clear-button:active {
    color: var(--background);
  }
</style>

<div class="completed-list-header">
  <h1>Completed</h1>
  <div class="clear-button" on:click={handleClearCompletedClick}>
    <Icon data={timesCircle} scale={1.5} />
  </div>
</div>
{#each $downloadedBeatmaps as item}
  <div class="list">
    <DownloadsListItem beatmap={item} isDownloading={false} />
  </div>
{/each}
