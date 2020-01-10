<script>
  import { previewUrl, beatmapPreview } from "../stores/beatmap-preview.store";
  import Fab from "./Fab.svelte";
  import Icon from "svelte-awesome";
  import { play, pause, volumeUp, volumeOff } from "svelte-awesome/icons";

  let currentTime = 0;
  let duration;
  let paused;
  let volume = 1;

  $: formattedCurrentTime = formatAsTime(currentTime);
  $: formattedDuration = formatAsTime(duration);

  function handleEnded() {
    beatmapPreview.stop();
  }

  function formatAsTime(timeInSeconds) {
    if (!duration) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.round(timeInSeconds % 60);

    if (seconds < 10) {
      return `${minutes}:0${seconds}`;
    }
    return `${minutes}:${seconds}`;
  }

  function handlePlayClick() {
    paused = false;
  }

  function handlePauseClick() {
    paused = true;
  }

  function handleVolumeClick() {
    volume = 0;
  }

  function handleMuteClick() {
    volume = 1;
  }
</script>

<style>
  .audio-container {
    background-color: var(--background);
    padding: 0;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .audio-container * {
    margin-left: 16px;
    margin-right: 8px;
  }

  img {
    border: none;
    outline: none;

    height: 56px;
    width: 56px;
  }

  input {
    padding-left: 0;
    padding-right: 0;
    border-left: 0;
    border-right: 0;
  }
</style>

<audio
  autoplay
  src={$previewUrl}
  on:ended={handleEnded}
  bind:volume
  bind:paused
  bind:currentTime
  bind:duration />

<div class="audio-container">
  <img
    src={$beatmapPreview ? 'http://beatsaver.com' + $beatmapPreview.coverURL : ''}
    alt="" />
  <div>{formattedCurrentTime} / {formattedDuration}</div>
  {#if paused}
    <Fab
      on:click={handlePlayClick}
      iconColor="var(--foregroundText)"
      color="var(--background)"
      hoverColor="var(--foreground)"
      iconData={play}
      iconScale={1.25} />
  {:else}
    <Fab
      on:click={handlePauseClick}
      iconColor="var(--foregroundText)"
      color="var(--background)"
      hoverColor="var(--foreground)"
      iconData={pause}
      iconScale={1.25} />
  {/if}
  <input
    type="range"
    name="points"
    min={0}
    on:input={event => {
      currentTime = event.target.value;
    }}
    max={duration}
    value={currentTime} />
  {#if volume > 0}
    <Fab
      on:click={handleVolumeClick}
      iconColor="var(--foregroundText)"
      hoverColor="var(--foreground)"
      color="var(--background)"
      iconData={volumeUp}
      iconScale={1.25} />
  {:else}
    <Fab
      on:click={handleMuteClick}
      iconColor="var(--foregroundText)"
      hoverColor="var(--foreground)"
      color="var(--background)"
      iconData={volumeOff}
      iconScale={1.25} />
  {/if}
</div>
