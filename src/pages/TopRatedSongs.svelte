<script>
  import SvelteInfiniteScroll from "svelte-infinite-scroll";
  import BeatmapList from "../components/BeatmapList.svelte";
  import BeatmapListItem from "../components/BeatmapListItem.svelte";
  import { topRatedMapsStore } from "../stores/beatmap.store";
  import { beatmapPreview } from "../stores/beatmap-preview.store";
  import { downloads } from "../stores/downloads.store";

  async function handleLoadMore() {
    await topRatedMapsStore.loadNextPage();
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

{#if $topRatedMapsStore.songs.length == 0}
  {#await handleLoadMore()}
    <span>Loading Songs...</span>
  {:then songs}
    <BeatmapList>

      {#each $topRatedMapsStore.songs as beatmap}
        <BeatmapListItem
          on:preview={handlePreview}
          on:stop={handleStop}
          on:download={handleDownload}
          {beatmap} />
      {/each}
      <SvelteInfiniteScroll threshold={10} on:loadMore={handleLoadMore} />

    </BeatmapList>
  {:catch error}
    <div>Error Loading Songs</div>
    <div>{error}</div>
  {/await}
{:else}
  <BeatmapList>

    {#each $topRatedMapsStore.songs as beatmap}
      <BeatmapListItem
        on:preview={handlePreview}
        on:stop={handleStop}
        on:download={handleDownload}
        {beatmap} />
    {/each}
    <SvelteInfiniteScroll threshold={10} on:loadMore={handleLoadMore} />

  </BeatmapList>
{/if}
