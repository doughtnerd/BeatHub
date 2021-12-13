<script>
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import { topRatedMapsStore } from "../stores/beatmap.store";
  import { beatmapPreviewStore } from "../stores/beatmap-preview.store";
  import { beatmapVideoPreviewStore } from "../stores/beatmap-video-preview.store";
  import { downloads } from "../stores/downloads.store";
  import { onMount } from "svelte";

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
    <div style="height: 80px">
      <LoadingScreen />
    </div>
  {/if}
{/await}
