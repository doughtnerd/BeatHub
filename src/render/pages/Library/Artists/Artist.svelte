<script>
  import { onMount } from "svelte";
  import { arrowLeft } from "svelte-awesome/icons";
  import { pop } from 'svelte-spa-router';
  import { writable } from "svelte/store";
  import TextButton from "../../../components/TextButton.svelte";
  import SongList from "../SongList.svelte";
  import Icon from "svelte-awesome";
  import Grid from '../../../components/Grid.svelte';
  export let params = {}

  const songsByArtistStore = writable([]);

  onMount(() => {
    getSongsByArtist();
  });

  function getSongsByArtist() {
    window.api.invoke('getSongsByArtist', {artist: params.artist}).then(songs => {
      songsByArtistStore.set(songs);
    });
  }

  function handleDeleteSong(song) {
    window.api.invoke('deleteSong', {folder_hash: song.folder_hash}).then(() => getSongsByArtist());
  }
</script>

<Grid columns="1fr 1fr 1fr">
  <TextButton style="place-self:center start;" on:click={() => pop()}><Icon data={arrowLeft} scale=.75 /> Back</TextButton>
  <h3 style="place-self:center">{params.artist}</h3>
</Grid>

{#if $songsByArtistStore.length > 0}
  <SongList songs={$songsByArtistStore} on:delete={(event) => handleDeleteSong(event.detail.song)} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No Songs Found</h1>
  </div>
{/if}