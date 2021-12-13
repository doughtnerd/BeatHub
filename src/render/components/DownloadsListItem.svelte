<script>
  import Icon from "svelte-awesome";
  import { check } from "svelte-awesome/icons";
  import LoadingSpinner from "../components/LoadingSpinner.svelte";

  export let isDownloading;
  export let beatmap;
</script>

<div class="list-item">
  {#if isDownloading}
    <div>
      <LoadingSpinner />
    </div>
  {:else}
    <div>
      <Icon data={check} />
    </div>
  {/if}
  <span>
    {beatmap.id} - {beatmap.metadata.songName} ({beatmap.metadata.songAuthorName})
  </span>
</div>

<style>
  .list-item {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .list-item * {
    margin-right: 16px;
  }
</style>
