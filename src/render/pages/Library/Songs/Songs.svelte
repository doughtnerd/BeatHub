<script>
  import FullPageCenteredLayout from "../../../components/FullPageCenteredLayout.svelte";
import { libraryStore } from "../../../stores/library.store";
  import SongList from "../_shared/SongList.svelte";
</script>

{#if $libraryStore.length > 0}
  <p>Found {$libraryStore.length} Songs</p>
  <SongList songs={$libraryStore} on:delete={(event) => libraryStore.deleteSong(event.detail.song)} />
{:else}
  <FullPageCenteredLayout>
    <h1>No Songs Found</h1>
  </FullPageCenteredLayout>
{/if}