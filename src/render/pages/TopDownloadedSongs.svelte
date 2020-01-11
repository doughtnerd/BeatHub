<script>
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import { topDownloadedMapsStore } from "../stores/beatmap.store";
  import { beatmapPreviewStore } from "../stores/beatmap-preview.store";
  import { downloads } from "../stores/downloads.store";
  import { onMount } from "svelte";

  let init;

  onMount(() => {
    if ($topDownloadedMapsStore.maps.length === 0) {
      init = topDownloadedMapsStore.loadNextPage();
    }
  });

  async function handleLoadMore() {
    await topDownloadedMapsStore.loadNextPage();
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
</script>

{#await init}
  <LoadingScreen />
{:then results}
  <InfiniteBeatmapList
    maps={$topDownloadedMapsStore.maps}
    on:preview={handlePreview}
    on:stop={handleStop}
    on:download={handleDownload}
    on:loadMore={handleLoadMore} />
  {#if $topDownloadedMapsStore.loading}
    <div style="height: 80px">
      <LoadingScreen />
    </div>
  {/if}
{/await}
