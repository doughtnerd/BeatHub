<script>
  import { onMount } from "svelte";
  import { pop } from 'svelte-spa-router';
  import { writable } from "svelte/store";
  import TextButton from "../../../components/TextButton.svelte";
  import SongList from "../SongList.svelte";
  import Icon from 'svelte-awesome'
import { arrowLeft } from "svelte-awesome/icons";

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

<div style="display:flex;flex-direction:row;">
  <TextButton on:click={() => pop()}><Icon data={arrowLeft} scale=.75 /> Back</TextButton>
</div>

{#if $songsByUploaderStore.length > 0}
  <SongList songs={$songsByUploaderStore} on:deleteSong={handleDeleteSong} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No songs found</h1>
  </div>
{/if}