<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LinkButton from '../../../components/LinkButton.svelte';

  const artistsStore = writable([]);

  onMount(() => {
    window.api.invoke('getArtists').then(uploaders => {
      artistsStore.set(uploaders.map(u => u.song_author));
    });
  });
</script>

<div style="display:flex;flex-direction:column;">
  {#each $artistsStore as artist}
    <LinkButton to={`/library/artists/${artist}`}>{artist}</LinkButton>
  {/each}
</div>