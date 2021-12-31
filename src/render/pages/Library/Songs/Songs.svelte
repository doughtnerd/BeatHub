<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import SongList from '../SongList.svelte';

  const songsStore = writable([]);

  onMount(() => {
    getAllSongs();
  });

  function getAllSongs() {
    window.api.invoke('getAllSongs').then(songs => {
      songsStore.set(songs);
    });
  }

  function handleDeleteSong(song) {
    window.api.invoke('deleteSong', {folder_hash: song.folder_hash}).then(() => getAllSongs());
  }
</script>

{#if $songsStore.length > 0}
  <SongList songs={$songsStore} on:delete={(event) => handleDeleteSong(event.detail.song)} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No Songs Found</h1>
  </div>
{/if}

