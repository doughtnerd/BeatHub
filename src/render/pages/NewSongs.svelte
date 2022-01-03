<script>
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import { newMapsStore } from "../stores/beatmap.store";
  import { beatmapPreviewStore } from "../stores/beatmap-preview.store";
  import { beatmapVideoPreviewStore } from "../stores/beatmap-video-preview.store";
  import { downloads } from "../stores/downloads.store";
  import { onMount } from "svelte";

  let init;

  onMount(() => {
    if ($newMapsStore.maps.length === 0) {
      init = newMapsStore.loadNextPage();
    }
  });

  async function handleLoadMore() {
    await newMapsStore.loadNextPage();
  }

  function handlePreview({ detail }) {
    beatmapPreviewStore.preview(detail);
  }

  function handleStop() {
    beatmapPreviewStore.stop();
  }

  function handleDownload({ detail }) {
    downloads.download(detail);
  }

  function handleVideoPreview({ detail }) {
    beatmapPreviewStore.stop();
    beatmapVideoPreviewStore.preview(detail);
  }
</script>

<style>
  .loading-screen-layout {
    height: 80px;
  }
</style>

{#await init}
  <LoadingScreen />
{:then results}
  <InfiniteBeatmapList
    maps={$newMapsStore.maps}
    on:preview={handlePreview}
    on:stop={handleStop}
    on:download={handleDownload}
    on:loadMore={handleLoadMore}
    on:videoPreview={handleVideoPreview}
  />
  {#if $newMapsStore.loading}
    <div class="loading-screen-layout">
      <LoadingScreen />
    </div>
  {/if}
{/await}
