<script>
  import { searchStore } from "../stores/search.store";
  import SvelteInfiniteScroll from "svelte-infinite-scroll";
  import BeatmapList from "../components/BeatmapList.svelte";
  import BeatmapListItem from "../components/BeatmapListItem.svelte";
  import { beatmapPreview } from "../stores/beatmap-preview.store";
  import { downloads } from "../stores/downloads.store";

  async function handleLoadMore() {
    await searchStore.loadNextPage();
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
  function handleSearch(event) {
    searchStore.search(event.target.value);
  }
</script>

<style>
  .search-container {
    background-color: var(--forground);
    /* position: ; */
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    /* width: 90%; */
    height: 72px;
    align-items: center;
  }

  .form__group {
    position: relative;
    padding: 15px 0 0;
    margin-top: 10px;
    width: 80%;
  }

  .form__field {
    font-family: inherit;
    width: 100%;
    border: 0;
    border-bottom: 2px solid #9b9b9b;
    outline: 0;
    font-size: 1.3rem;
    color: var(--foregroundText);
    padding: 7px 0;
    background: transparent;
    transition: border-color 0.2s;
  }
  .form__field::placeholder {
    color: transparent;
  }
  .form__field:placeholder-shown ~ .form__label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;
  }

  .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: var(--foregroundText);
  }

  .form__field:focus {
    padding-bottom: 6px;
    font-weight: 700;
    border-width: 3px;
    border-image: linear-gradient(to right, var(--primary), var(--secondary));
    border-image-slice: 1;
  }
  .form__field:focus ~ .form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #59b0f3;
    font-weight: 700;
  }

  /* reset input */
  .form__field:required,
  .form__field:invalid {
    box-shadow: none;
  }

  .song-list-container {
    padding-top: 72px;
    overflow: hidden;
    /* height: calc(100% - 64px); */
    max-height: calc(100% - 72px);
  }
</style>

<div style="display: flex; flex-direction: column; height: 100%">
  <div class="search-container">
    <div class="form__group field">
      <input
        on:change={handleSearch}
        type="search"
        class="form__field"
        placeholder="Name"
        name="search"
        id="search"
        required />
      <label for="search" class="form__label">Search</label>
    </div>

  </div>

  {#if $searchStore.songs.length == 0}
    {#await handleLoadMore()}
      <span>Loading Songs...</span>
    {:then songs}
      <BeatmapList>

        {#each $searchStore.songs as beatmap}
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

      {#each $searchStore.songs as beatmap}
        <BeatmapListItem
          on:preview={handlePreview}
          on:stop={handleStop}
          on:download={handleDownload}
          {beatmap} />
      {/each}
      <SvelteInfiniteScroll threshold={10} on:loadMore={handleLoadMore} />

    </BeatmapList>
  {/if}
</div>
