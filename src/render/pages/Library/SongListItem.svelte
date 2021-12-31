<script>
  import { createEventDispatcher } from "svelte";
  import { eye, play, trash } from "svelte-awesome/icons";
  import Fab from '../../components/Fab.svelte';
  import { beatmapPreviewStore } from "../../stores/beatmap-preview.store";
import { beatmapVideoPreviewStore } from "../../stores/beatmap-video-preview.store";

  export let song;

  const dispatch = createEventDispatcher();

  function handleDeleteClick() {
    dispatch("delete", { song });
  }

  function handlePlayClick() {
    beatmapPreviewStore.previewWithUrl(`${song.disk_location}/${song.song_filename}`,`${song.disk_location}/${song.cover_filename}`)
  }

  function handlePreviewClick() { 
    beatmapPreviewStore.stop();
    beatmapVideoPreviewStore.preview({id: song.key});
  }
</script>


<style>
  .library-tile {
    display: flex;
    padding: 8px;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 16px;
    background-color: var(--background);
    color:var(--backgroundText);
    align-items: center;
  }

  .library-tile > img {
    width: 64px;
    height: 64px;
    border-radius: 12px;
  }

  .button-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

</style>

<div class="library-tile">
  <img src={`${song.disk_location}/${song.cover_filename}`} alt="">
  <div style="display:flex;flex-direction:column;justify-content:center; align-items:center;padding: 0px 8px 0 8px">
    <span>{song.song_title}</span>
    <span>{song.song_author}</span>
    <sub>Uploaded By: {song.uploader}</sub>
  </div>
  <div class="button-area">
    {#if song.key}
      <Fab tooltipText="Visual Preview" on:click={handlePreviewClick} scale={6} iconColor="white" color="var(--beatmapUpvotesIconColor)" iconData={eye} iconScale={1.5} />
    {:else}
      <Fab tooltipText="Visual Preview is unavailable" disabled={true} scale={6} iconColor="white" color="gray" iconData={eye} iconScale={1.5} />
    {/if}
    <Fab tooltipText="Play" on:click={handlePlayClick} scale={6} iconColor="white" color="var(--primary)" iconData={play} iconScale={1.5} />
    <Fab tooltipText="Delete" on:click={handleDeleteClick} scale={6} iconColor="white" color="var(--error)" iconData={trash} iconScale={1.5} />
  </div>
</div>