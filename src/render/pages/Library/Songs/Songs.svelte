<script>
  import { libraryStore } from '../../../stores/library.store';
  import SongList from '../_shared/SongList.svelte';

</script>

{#if $libraryStore.length > 0}
  <SongList songs={$libraryStore} on:delete={(event) => libraryStore.deleteSong(event.detail.song)} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No Songs Found</h1>
  </div>
{/if}
