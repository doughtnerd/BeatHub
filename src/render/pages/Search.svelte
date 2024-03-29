<script>
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import InfiniteBeatmapList from "../components/InfiniteBeatmapList.svelte";
  import { searchStore } from "../stores/search.store";
  import { beatmapPreviewStore } from "../stores/beatmap-preview.store";
  import { beatmapVideoPreviewStore } from "../stores/beatmap-video-preview.store";
  import { downloads } from "../stores/downloads.store";
  import { networkIsOnline } from "../stores/network.store";
  import FullPageCenteredLayout from "../components/FullPageCenteredLayout.svelte";

  async function handleLoadMore() {
    await searchStore.loadNextPage();
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

  function handleSearch(event) {
    searchStore.search(event.target.value);
  }

  function debounce(func, timeout) {
    let timer;
    return (...args) => {
      const next = () => func(...args);
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(next, timeout > 0 ? timeout : 300);
    };
  }
</script>

<div class="display-container">
  {#if $networkIsOnline}
    <div class="search-container">
      <div class="form__group field">
        <input
          on:change={handleSearch}
          on:input={debounce(handleSearch, 500)}
          type="search"
          class="form__field"
          placeholder="Name"
          name="search"
          id="search"
          required
        />
        <label for="search" class="form__label">Search</label>
      </div>
    </div>
  
    {#if $searchStore.searching}
      <LoadingScreen />
    {:else}
      <InfiniteBeatmapList
        maps={$searchStore.maps}
        on:preview={handlePreview}
        on:stop={handleStop}
        on:download={handleDownload}
        on:loadMore={handleLoadMore}
        on:videoPreview={handleVideoPreview}
      />
      {#if $searchStore.loading}
        <div class="loading-screen-layout">
          <LoadingScreen />
        </div>
      {/if}
    {/if}
  {:else}
    <FullPageCenteredLayout>
      <div>
        <h1>No internet connection</h1>
        <p>
          You need an internet connection search songs.
        </p>
      </div>
    </FullPageCenteredLayout>
  {/if}
</div>

<style>

  .loading-screen-layout {
    height:80px;
  }

  .display-container {
    display: flex; flex-direction: column; height: 100%
  }

  .search-container {
    background-color: var(--forground);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
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
    border-bottom: 2px solid var(--backgroundText);
    outline: 0;
    font-size: 1.3rem;
    color: var(--backgroundText);
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
    color: var(--backgroundText);
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
    color: var(--primary);
    font-weight: 700;
  }

  /* reset input */
  .form__field:required,
  .form__field:invalid {
    box-shadow: none;
  }
</style>
