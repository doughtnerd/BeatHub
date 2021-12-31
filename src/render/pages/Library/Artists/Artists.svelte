<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LinkButton from '../../../components/LinkButton.svelte';
  import List from '../../../components/List.svelte';
  import LoadingScreen from '../../../components/LoadingScreen.svelte';

  const artistsStore = writable([]);

  onMount(() => {
    artistsStore.set(
      window.api.invoke('getArtists')
        .then(artists => artists.map(u => u.song_author))
        .catch(() => [])
    );
  });
</script>

{#await $artistsStore}
  <LoadingScreen />
{:then artists}
  {#if artists.length > 0}
    <List>
      {#each artists as artist}
        <LinkButton style="border-radius:8px;text-align:left;"  to={`/library/artists/${artist}`}>{artist}</LinkButton>
      {/each}
    </List>
  {:else}
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <h1>No Artists Found</h1>
    </div>
  {/if}
{/await}