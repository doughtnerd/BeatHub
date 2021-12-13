<script>
  import BeatmapList from "./BeatmapList.svelte";
  import BeatmapListItem from "./BeatmapListItem.svelte";
  import SvelteInfiniteScroll from "svelte-infinite-scroll";

  export let maps;
</script>

<BeatmapList>
  {#each maps as beatmap}
    <BeatmapListItem on:preview on:stop on:download on:videoPreview {beatmap} />
  {/each}
  <SvelteInfiniteScroll threshold={10} on:loadMore />
</BeatmapList>
