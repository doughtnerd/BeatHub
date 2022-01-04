<script>
  import { libraryStore } from "../../../stores/library.store";
  import SongList from "../_shared/SongList.svelte";
</script>

{#if $libraryStore.length > 0}
  <p>Found {$libraryStore.length} Songs</p>
  <SongList songs={$libraryStore} on:delete={(event) => libraryStore.deleteSong(event.detail.song)} />
{:else}
  <div class="no-songs-display">
    <h1>No Songs Found</h1>
  </div>
{/if}

<style>
  .no-songs-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
