<script>
  import { onMount } from "svelte";
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import { hotMapsStore } from "../stores/beatmap.store";
  import { beatmapPreview } from "../stores/beatmap-preview.store";
  import { downloads } from "../stores/downloads.store";

  let init;

  onMount(() => {
    if ($hotMapsStore.maps.length === 0) {
      init = hotMapsStore.loadNextPage();
    }
  });

  async function handleLoadMore() {
    await hotMapsStore.loadNextPage();
  }

  function handlePreview({ detail }) {
    beatmapPreview.preview(detail);
  }

  function handleStop() {
    beatmapPreview.stop();
  }

  function handleDownload({ detail }) {
    downloads.download(detail);
  }
</script>

{#await init}
  <LoadingScreen />
{:then results}
  <InfiniteBeatmapList
    maps={$hotMapsStore.maps}
    on:preview={handlePreview}
    on:stop={handleStop}
    on:download={handleDownload}
    on:loadMore={handleLoadMore} />
  {#if $hotMapsStore.loading}
    <div style="height: 80px">
      <LoadingScreen />
    </div>
  {/if}
{/await}
