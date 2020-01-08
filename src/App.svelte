<script>
  import Drawer from "./components/Drawer.svelte";
  import Icon from "svelte-awesome";
  import {
    search,
    fire,
    star,
    exclamation,
    arrowCircleDown
  } from "svelte-awesome/icons";
  import {
    NEW_SONGS,
    SEARCH,
    HOT_SONGS,
    TOP_RATED_SONGS,
    TOP_DOWNLOADED_SONGS,
    activeView
  } from "./stores/active-view.store";
  import NewSongs from "./pages/NewSongs.svelte";
  import HotSongs from "./pages/HotSongs.svelte";
  import TopRatedSongs from "./pages/TopRatedSongs.svelte";
  import TopDownloadedSongs from "./pages/TopDownloadedSongs.svelte";
  import Search from "./pages/Search.svelte";
  import AudioPlayer from "./components/AudioPlayer.svelte";

  function handleNavClick(navItem) {
    activeView.set(navItem);
  }
</script>

<style>
  .drawer-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  .drawer-content * {
    padding: 16px 8px 16px 8px;
    text-align: center;
  }

  .drawer-content *:hover {
    background-color: rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  .drawer-content *:active,
  .drawer-content .active {
    background-color: rgba(0, 0, 0, 0.25);
    color: #11998e;
  }
</style>

<Drawer mode="slim">
  <ul class="drawer-content" slot="drawer-content">
    <li
      class:active={$activeView === SEARCH}
      on:click={() => {
        handleNavClick(SEARCH);
      }}>
      <Icon scale={2} data={search} />
    </li>
    <li
      class:active={$activeView === TOP_RATED_SONGS}
      on:click={() => {
        handleNavClick(TOP_RATED_SONGS);
      }}>
      <Icon scale={2} data={star} />
    </li>
    <li
      class:active={$activeView === TOP_DOWNLOADED_SONGS}
      on:click={() => {
        handleNavClick(TOP_DOWNLOADED_SONGS);
      }}>
      <Icon scale={2} data={arrowCircleDown} />
    </li>
    <li
      class:active={$activeView === HOT_SONGS}
      on:click={() => {
        handleNavClick(HOT_SONGS);
      }}>
      <Icon scale={2} data={fire} />
    </li>
    <li
      class:active={$activeView === NEW_SONGS}
      on:click={() => {
        handleNavClick(NEW_SONGS);
      }}>
      <Icon scale={2} data={exclamation} />
    </li>
  </ul>
  {#if $activeView === NEW_SONGS}
    <NewSongs />
  {/if}
  {#if $activeView === HOT_SONGS}
    <HotSongs />
  {/if}
  {#if $activeView === TOP_RATED_SONGS}
    <TopRatedSongs />
  {/if}
  {#if $activeView === TOP_DOWNLOADED_SONGS}
    <TopDownloadedSongs />
  {/if}
  {#if $activeView === SEARCH}
    <Search />
  {/if}
</Drawer>

<div
  style="position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);">
  <AudioPlayer />
</div>
