<script>
  import { onMount } from "svelte";
  import { arrowLeft } from "svelte-awesome/icons";
  import { pop } from 'svelte-spa-router';
  import { writable } from "svelte/store";
  import TextButton from "../../../components/TextButton.svelte";
  import SongList from "../SongList.svelte";
  import Icon from "svelte-awesome";

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

<div style="display:flex;flex-direction:row;">
  <TextButton on:click={() => pop()}><Icon data={arrowLeft} scale=.75 /> Back</TextButton>
</div>

{#if $songsByArtistStore.length > 0}
  <SongList songs={$songsByArtistStore} on:deleteSong={handleDeleteSong} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No Songs Found</h1>
  </div>
{/if}