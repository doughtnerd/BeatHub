<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import SongList from '../SongList.svelte';

  const songsStore = writable([]);

  onMount(() => {
    window.api.invoke('getAllSongs').then(songs => {
      songsStore.set(songs);
    });
  });
</script>

<div style="display:flex;flex-direction:column;">
  <SongList songs={$songsStore} />
</div>