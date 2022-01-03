<script>
  import { createEventDispatcher } from "svelte";
  import { eye,play,trash } from "svelte-awesome/icons";
  import Fab from '../../../components/Fab.svelte';
  import Grid from "../../../components/Grid.svelte";
  import { beatmapPreviewStore } from "../../../stores/beatmap-preview.store";
  import { beatmapVideoPreviewStore } from "../../../stores/beatmap-video-preview.store";

  export let song;

  const dispatch = createEventDispatcher();

  // $: isCurrentlyPlaying = $activeBeatmapPreviewKey === song.key

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

  // function handleStopClick() {
  //   beatmapPreviewStore.stop();
  // }
</script>


<style>
  .library-tile {
    padding: 8px;
    border-radius: 16px;
    background-color: var(--background);
    color:var(--backgroundText);
  }

  img {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    place-self: center start;
  }

  .button-area {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-grow: .33
  }

  .song-info {
    display:flex;
    flex-direction:column;
    justify-content:center; 
    align-items:center;
    padding: 0px 8px 0 8px;
  }

</style>

<div class="library-tile">
  <Grid columns="64px 1fr 160px" rows="min-content">
    <img src={`${song.disk_location}/${song.cover_filename}`} alt={`${song.song_title} Cover`}>

    <div class="song-info">
      <span>{song.song_title}</span>
      <span>{song.song_author}</span>
      <sub>Uploaded By: {song.uploader}</sub>
    </div>

    <div class="button-area">
      {#if song.key}
        <Fab tooltipText="Visual Preview" on:click={handlePreviewClick} scale={6} iconColor="white" color="var(--expertPlusChipBackgroundColor)" iconData={eye} iconScale={1.5} />
      {:else}
        <Fab tooltipText="Visual Preview is unavailable" disabled={true} scale={6} iconColor="white" color="gray" iconData={eye} iconScale={1.5} />
      {/if}
  
      <!-- {#if !isCurrentlyPlaying} -->
        <Fab tooltipText="Play" on:click={handlePlayClick} scale={6} iconColor="white" color="var(--primary)" iconData={play} iconScale={1.5} />
      <!-- {:else}
        <Fab tooltipText="Stop" on:click={handleStopClick} scale={6} iconColor="white" color="#BD2942" iconData={stop} iconScale={1.5} />
      {/if} -->
  
      <Fab tooltipText="Delete" on:click={handleDeleteClick} scale={6} iconColor="white" color="var(--error)" iconData={trash} iconScale={1.5} />
    </div>
  </Grid>
  
</div>