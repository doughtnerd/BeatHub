<script>
  import { pause,play,volumeOff,volumeUp } from "svelte-awesome/icons";
  import { beatmapPreviewStore } from "../stores/beatmap-preview.store";
  import Fab from "./Fab.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";

  let currentTime = 0;
  let duration;
  let paused = true;
  let volume = 1;

  $: formattedCurrentTime = formatAsTime(currentTime);
  $: formattedDuration = formatAsTime(duration);
  $: volumeIcon = volume > 0 ? volumeUp : volumeOff;

  function handleEnded() {
    beatmapPreviewStore.stop();
    currentTime = 0;
    duration = 0;
  }

  function formatAsTime(timeInSeconds) {
    if (!timeInSeconds) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  function handleOnInput(event) {
    if (!$beatmapPreviewStore.previewUrl) return;
    currentTime = event.target.value;
  }

  function handlePlayClick() {
    if (!$beatmapPreviewStore.previewUrl) return;
    paused = false;
  }

  function handlePauseClick() {
    if (!$beatmapPreviewStore.previewUrl) return;
    paused = true;
  }

  function handleVolumeClick() {
    if (volume > 0) {
      volume = 0;
    } else {
      volume = 1;
    }
  }
</script>

<audio autoplay src={$beatmapPreviewStore.previewUrl} on:ended={handleEnded} bind:volume bind:paused bind:currentTime bind:duration />

<div class="audio-container">
  {#if $beatmapPreviewStore.loading}
    <div class="loading-indicator-container">
      <LoadingSpinner />
    </div>
  {:else if $beatmapPreviewStore.activePreview}
    <img src={$beatmapPreviewStore.activePreview.versions[0].coverURL} alt="song" />
  {:else}
    <div class="placeholder" />
  {/if}
  <div class="time-display">{formattedCurrentTime} / {formattedDuration}</div>
  <div class="time-control">
    <input type="range" name="points" min={0} on:input={handleOnInput} max={duration} value={currentTime} />
  </div>
  <div class="play-control">
    {#if paused}
      <Fab on:click={handlePlayClick} iconColor="var(--backgroundText)" color="var(--background)" iconData={play} iconScale={1.25} />
    {:else}
      <Fab on:click={handlePauseClick} iconColor="var(--backgroundText)" color="var(--background)" iconData={pause} iconScale={1.25} />
    {/if}
  </div>
  <div class="volume-control">
    <Fab on:click={handleVolumeClick} iconColor="var(--backgroundText)" color="var(--background)" iconData={volumeIcon} iconScale={1.25} />
  </div>
</div>

<style>

  .placeholder {
    height: 56px;
    width: 56px;
  }

  .loading-indicator-container {
    display: flex; 
    flex-direction: column; 
    justify-content: center;
    height: 56px; 
    width: 56px;
  }
  .audio-container {
    background-color: var(--background);
    padding: 0;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    width: 500px;
  }

  .audio-container * {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .time-display {
    color: var(--backgroundText);
  }

  img {
    border: none;
    outline: none;

    height: 56px;
    width: 56px;
    border: 1px solid var(--background);
  }

  input {
    padding-left: 0;
    padding-right: 0;
    border-left: 0;
    border-right: 0;
  }
</style>
