<script>
  import { download, play, stop } from "svelte-awesome/icons";
  import { createEventDispatcher } from "svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import BeatmapStats from "./BeatmapStats.svelte";
  import Fab from "./Fab.svelte";
  import PrimaryText from "./PrimaryText.svelte";
  import SecondaryText from "./SecondaryText.svelte";
  import NormalChip from "./NormalChip.svelte";
  import EasyChip from "./EasyChip.svelte";
  import HardChip from "./HardChip.svelte";
  import ExpertChip from "./ExpertChip.svelte";
  import ExpertPlusChip from "./ExpertPlusChip.svelte";
  import ModeChip from "./ModeChip.svelte";
  import ListDivider from "./ListDivider.svelte";

  import {
    beatmapPreviewStore,
    activeBeatmapPreviewKey,
    beatmapToPreviewKey
  } from "../stores/beatmap-preview.store";

  import { downloads } from "../stores/downloads.store";

  export let beatmap;

  $: isCurrentlyPlaying = $activeBeatmapPreviewKey === beatmap.key;
  $: isCurrentlyDownloading = $downloads.downloading.hasOwnProperty(
    beatmap.key
  );
  $: isCurrentlyLoading =
    $beatmapToPreviewKey === beatmap.key && $beatmapPreviewStore.loading;

  const dispatch = createEventDispatcher();

  function handleDownloadClick() {
    dispatch("download", beatmap);
  }

  function handlePreviewClick() {
    dispatch("preview", beatmap);
  }

  function handleStopClick() {
    dispatch("stop", beatmap);
  }
</script>

<style type="text/scss">
  :root {
    --beatmapListItemCoverImgSize: 150px;
  }

  .beatmap-list-item {
    height: var(--beatmapListItemCoverImgSize);
    max-height: var(--beatmapListItemCoverImgSize);
    padding: 8px;

    display: flex;
    flex-flow: row;

    .beatmap-graphic-container {
      position: relative;
      text-align: center;
      flex-shrink: 0.2;

      img {
        width: var(--beatmapListItemCoverImgSize);
        height: var(--beatmapListItemCoverImgSize);
      }
    }

    .beatmap-info-container {
      display: flex;
      flex-direction: column;
      flex-grow: 2;
      justify-content: space-between;
      padding: 0 8px 8px 8px;
      overflow: hidden;

      .beatmap-song-info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
      }

      .beatmap-modes > * {
        margin-right: 8px;
      }
    }

    .beatmap-meta {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .beatmap-audio-controls {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;

        div {
          margin-left: 8px;
        }
      }
    }
  }
</style>

<div class="beatmap-list-item">
  <div class="beatmap-graphic-container">
    <img src="https://beatsaver.com{beatmap.coverURL}" alt="beatmap cover" />
  </div>

  <div class="beatmap-info-container">

    <div class="beatmap-song-info">
      <PrimaryText>
        <span style="font-size: 24px">{beatmap.metadata.songName}</span>
      </PrimaryText>
      <SecondaryText>{beatmap.metadata.songAuthorName}</SecondaryText>
      <SecondaryText>
        Uploaded by: {beatmap.metadata.levelAuthorName}
      </SecondaryText>
    </div>

    <div class="beatmap-difficulties">
      {#if beatmap.metadata.difficulties.easy}
        <EasyChip />
      {/if}
      {#if beatmap.metadata.difficulties.normal}
        <NormalChip />
      {/if}
      {#if beatmap.metadata.difficulties.hard}
        <HardChip />
      {/if}
      {#if beatmap.metadata.difficulties.expert}
        <ExpertChip />
      {/if}
      {#if beatmap.metadata.difficulties.expertPlus}
        <ExpertPlusChip />
      {/if}
    </div>

    <div class="beatmap-modes">
      {#each beatmap.metadata.characteristics as characteristic}
        <ModeChip>{characteristic.name}</ModeChip>
      {/each}
    </div>

  </div>

  <div class="beatmap-meta">
    <BeatmapStats {beatmap} />

    <div class="beatmap-audio-controls">
      <div>
        {#if isCurrentlyLoading}
          <LoadingSpinner />
        {:else if !isCurrentlyPlaying}
          <Fab
            on:click={handlePreviewClick}
            scale={6}
            iconColor="white"
            color="var(--primary)"
            iconData={play}
            iconScale={1.5} />
        {:else}
          <Fab
            on:click={handleStopClick}
            scale={6}
            iconColor="white"
            color="#BD2942"
            iconData={stop}
            iconScale={1.5} />
        {/if}

      </div>
      <div>
        {#if isCurrentlyDownloading}
          <LoadingSpinner />
        {:else}
          <Fab
            on:click={handleDownloadClick}
            scale={6}
            iconColor="white"
            color="var(--secondary)"
            iconData={download}
            iconScale={1.5} />
        {/if}

      </div>
    </div>

  </div>

</div>
<ListDivider />
