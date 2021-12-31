<script>
  import { onMount } from "svelte";
  import { pop } from 'svelte-spa-router';
  import { writable } from "svelte/store";
  import TextButton from "../../../components/TextButton.svelte";
  import SongList from "../SongList.svelte";
  import Icon from 'svelte-awesome'
  import { arrowLeft } from "svelte-awesome/icons";
  import Grid from "../../../components/Grid.svelte";

  export let params = {}

  const songsByUploaderStore = writable([]);

  function getSongsByUploader() {
    window.api.invoke('getSongsByUploader', {uploader: params.uploader}).then(songs => {
      songsByUploaderStore.set(songs);
    });
  }

  onMount(() => {
    getSongsByUploader();
  });

  function handleDeleteSong(song) {
    window.api.invoke('deleteSong', {folder_hash: song.folder_hash}).then(() => getSongsByUploader());
  }
</script>

<Grid columns="1fr 1fr 1fr">
  <TextButton style="place-self:center start;" on:click={() => pop()}><Icon data={arrowLeft} scale=.75 /> Back</TextButton>
  <h3 style="place-self:center">{params.uploader}</h3>
</Grid>

{#if $songsByUploaderStore.length > 0}
  <SongList songs={$songsByUploaderStore} on:delete={(event) => handleDeleteSong(event.detail.song)} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No songs found</h1>
  </div>
{/if}