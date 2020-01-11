<script>
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import { newMapsStore } from "../stores/beatmap.store";
  import { beatmapPreview } from "../stores/beatmap-preview.store";
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
    maps={$newMapsStore.maps}
    on:preview={handlePreview}
    on:stop={handleStop}
    on:download={handleDownload}
    on:loadMore={handleLoadMore} />
  {#if $newMapsStore.loading}
    <div style="height: 80px">
      <LoadingScreen />
    </div>
  {/if}
{/await}
