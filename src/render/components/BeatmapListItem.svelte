<script>
  import { createEventDispatcher } from "svelte";
  import { download,eye,play,stop,save,check } from "svelte-awesome/icons";
  import { activeBeatmapPreviewKey,beatmapPreviewStore,beatmapToPreviewKey } from "../stores/beatmap-preview.store";
  import { downloads } from "../stores/downloads.store";
  import { libraryKeysStore } from "../stores/library.store";
  import BeatmapStats from "./BeatmapStats.svelte";
  import CharacteristicChip from "./CharacteristicChip.svelte";
  import Fab from "./Fab.svelte";
  import Icon from "svelte-awesome";
  import ListDivider from "./ListDivider.svelte";
  import LoadingSpinner from "./LoadingSpinner.svelte";
  import PrimaryText from "./PrimaryText.svelte";
  import SecondaryText from "./SecondaryText.svelte";

  export let beatmap;

  $: isCurrentlyPlaying = $activeBeatmapPreviewKey === beatmap.id;
  $: isCurrentlyDownloading = $downloads.downloading.hasOwnProperty(beatmap.id);
  $: isCurrentlyLoading = $beatmapToPreviewKey === beatmap.id && $beatmapPreviewStore.loading;
  $: isInLibrary = $libraryKeysStore.hasOwnProperty(beatmap.id);

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

  function handleVideoPreviewClick() {
    dispatch("videoPreview", beatmap);
  }
</script>

<div class="beatmap-list-item">
  <div class="beatmap-graphic-container">
    <img src={beatmap.versions[0].coverURL} alt="beatmap cover" />
  </div>

  <div class="beatmap-info-container">
    <div class="beatmap-song-info">
      <PrimaryText>
        <span class="song-name-text">{beatmap.metadata.songName}</span>
      </PrimaryText>
      <SecondaryText>
        {beatmap.metadata.songAuthorName.toLowerCase() === beatmap.metadata.levelAuthorName.toLowerCase()
          ? beatmap.metadata.songSubName
          : beatmap.metadata.songAuthorName}
      </SecondaryText>
      <SecondaryText>
        Uploaded by: {beatmap.metadata.levelAuthorName}
      </SecondaryText>
    </div>

    <div class="beatmap-difficulties">
      {#each beatmap.versions[0].diffs as mapDifficultyInfo}
        <div>
          <CharacteristicChip difficulty={mapDifficultyInfo.difficulty} characteristic={mapDifficultyInfo.characteristic} />
        </div>
      {/each}
    </div>
  </div>

  <div class="beatmap-meta">
    <BeatmapStats {beatmap} />

    <div class="beatmap-audio-controls">
      <div>
        <Fab 
          tooltipText="Visual Preview"
          on:click={handleVideoPreviewClick}
          scale={6}
          iconColor="white"
          color="var(--expertPlusChipBackgroundColor)"
          iconData={eye}
          iconScale={1.5}
        />
      </div>
      <div>
        {#if isCurrentlyLoading}
          <div class="spinner-wrapper">
            <LoadingSpinner />
          </div>
        {:else if !isCurrentlyPlaying}
          <Fab tooltipText="Play" on:click={handlePreviewClick} scale={6} iconColor="white" color="var(--primary)" iconData={play} iconScale={1.5} />
        {:else}
          <Fab tooltipText="Stop" on:click={handleStopClick} scale={6} iconColor="white" color="#BD2942" iconData={stop} iconScale={1.5} />
        {/if}
      </div>

      <div>
        {#if isCurrentlyDownloading}
          <div class="spinner-wrapper">
            <LoadingSpinner />
          </div>
        {:else}
          {#if !isInLibrary}
            <Fab tooltipText="Download" on:click={handleDownloadClick} scale={6} iconColor="white" color="var(--secondary)" iconData={download} iconScale={1.5} />
          {:else}
            <div class="in-library-indicator">
              <Icon scale={2} data={check} />
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</div>
<ListDivider />

<style>

  .song-name-text {
    font-size: 24px;
  }

  .in-library-indicator {
    display:flex;
    flex-direction:column;
    justify-items:center;
    align-items:center;
    width:48px;
    color:var(--beatmapUpvotesIconColor);
  }
  
  .spinner-wrapper {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .beatmap-list-item > .beatmap-graphic-container {
    position: relative;
    text-align: center;
    flex-shrink: 0.2;
  }
  
  .beatmap-graphic-container > img {
    width: var(--beatmapListItemCoverImgSize);
    height: var(--beatmapListItemCoverImgSize);
  }

  .beatmap-list-item > .beatmap-info-container {
    flex-grow: 2;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 0 8px 8px;
  }

  .beatmap-info-container > .beatmap-song-info {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .beatmap-difficulties {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  } 

  .beatmap-difficulties > *:not(:last-child) {
    margin-right: 4px;
  }

  .beatmap-list-item > .beatmap-meta {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 0.033;
  }
  .beatmap-meta > .beatmap-audio-controls {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .beatmap-list-item {
    height: var(--beatmapListItemCoverImgSize);
    max-height: var(--beatmapListItemCoverImgSize);
    padding: 8px;

    display: flex;
    flex-flow: row;
  }
</style>
