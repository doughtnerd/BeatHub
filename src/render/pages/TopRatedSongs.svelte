<script>
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import { topRatedMapsStore } from "../stores/beatmap.store";
  import { beatmapPreviewStore } from "../stores/beatmap-preview.store";
  import { beatmapVideoPreviewStore } from "../stores/beatmap-video-preview.store";
  import { downloads } from "../stores/downloads.store";
  import { onMount } from "svelte";
  import FullPageCenteredLayout from "../components/FullPageCenteredLayout.svelte";
  import { networkIsOnline } from "../stores/network.store";

  let init;

  onMount(() => {
    if ($topRatedMapsStore.maps.length === 0) {
      init = topRatedMapsStore.loadNextPage();
    }
  });

  async function handleLoadMore() {
    await topRatedMapsStore.loadNextPage();
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

{#if $networkIsOnline}
  {#await init}
    <LoadingScreen />
  {:then results}
    <InfiniteBeatmapList
      maps={$topRatedMapsStore.maps}
      on:preview={handlePreview}
      on:stop={handleStop}
      on:download={handleDownload}
      on:loadMore={handleLoadMore}
      on:videoPreview={handleVideoPreview}
    />
    {#if $topRatedMapsStore.loading}
      <div class="loading-screen-layout">
        <LoadingScreen />
      </div>
    {/if}
  {/await}
{:else}
  <FullPageCenteredLayout>
    <div>
      <h1>No internet connection</h1>
      <p>
        You need an internet connection browse songs.
      </p>
    </div>
  </FullPageCenteredLayout>
{/if}
