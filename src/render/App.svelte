<script>
  import Drawer from "./components/Drawer.svelte";
  import Icon from "svelte-awesome";
  import {
    search,
    fire,
    star,
    exclamation,
    arrowCircleDown,
    tasks,
    cog
  } from "svelte-awesome/icons";
  import {
    NEW_MAPS,
    SEARCH,
    HOT_MAPS,
    TOP_RATED_MAPS,
    TOP_DOWNLOADED_MAPS,
    SETTINGS,
    DOWNLOADS,
    activeView
  } from "./stores/active-view.store";
  import NewSongs from "./pages/NewSongs.svelte";
  import Downloads from "./pages/Downloads.svelte";
  import HotSongs from "./pages/HotSongs.svelte";
  import TopRatedSongs from "./pages/TopRatedSongs.svelte";
  import TopDownloadedSongs from "./pages/TopDownloadedSongs.svelte";
  import Search from "./pages/Search.svelte";
  import Settings from "./pages/Settings.svelte";
  import AudioPlayer from "./components/AudioPlayer.svelte";
  import Badge from "./components/Badge.svelte";
  import { downloads } from "./stores/downloads.store";

  $: numberOfDownloads = Object.keys($downloads.downloading).length;
</script>

<style>
  .drawer-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .drawer-item {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 72px;
    width: 100%;

    color: var(--foregroundText);
  }

  .drawer-item:hover {
    background-color: var(--foreground);
    cursor: pointer;
  }

  .drawer-item:active,
  .drawer-item.active {
    background-color: var(--foreground);
    color: var(--primary);
  }

  .app-container {
    height: 100vh;
    width: 100vw;

    display: flex;
    flex-direction: column;
  }

  .app-container::-webkit-scrollbar {
    display: none;
  }

  .main {
    overflow: hidden;
    flex-grow: 2;
  }

  .main::-webkit-scrollbar {
    display: none;
  }

  footer {
    color: var(--foregroundText);
    background-color: var(--background);

    height: 56px;
    flex-shrink: 0;

    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>

<div class="app-container">
  <div class="main">
    <Drawer mode="slim">
      <div class="drawer-content" slot="drawer-content">
        <div
          class="drawer-item"
          class:active={$activeView === SEARCH}
          on:click={() => {
            activeView.set(SEARCH);
          }}>
          <Icon scale={2} data={search} />
        </div>
        <div
          class="drawer-item"
          class:active={$activeView === TOP_RATED_MAPS}
          on:click={() => {
            activeView.set(TOP_RATED_MAPS);
          }}>
          <Icon scale={2} data={star} />
        </div>
        <div
          class="drawer-item"
          class:active={$activeView === TOP_DOWNLOADED_MAPS}
          on:click={() => {
            activeView.set(TOP_DOWNLOADED_MAPS);
          }}>
          <Icon scale={2} data={arrowCircleDown} />
        </div>
        <div
          class="drawer-item"
          class:active={$activeView === HOT_MAPS}
          on:click={() => {
            activeView.set(HOT_MAPS);
          }}>
          <Icon scale={2} data={fire} />
        </div>
        <div
          class="drawer-item"
          class:active={$activeView === NEW_MAPS}
          on:click={() => {
            activeView.set(NEW_MAPS);
          }}>
          <Icon scale={2} data={exclamation} />
        </div>
        <div
          class="drawer-item"
          class:active={$activeView === DOWNLOADS}
          on:click={() => {
            activeView.set(DOWNLOADS);
          }}>
          <Icon scale={2} data={tasks} />
          <div style="position: absolute; left: 8px">
            <Badge color="white" background="var(--error)">
              {numberOfDownloads}
            </Badge>
          </div>
        </div>
        <div
          class="drawer-item"
          class:active={$activeView === SETTINGS}
          on:click={() => {
            activeView.set(SETTINGS);
          }}>
          <Icon scale={2} data={cog} />
        </div>
      </div>

      {#if $activeView === NEW_MAPS}
        <NewSongs />
      {/if}
      {#if $activeView === HOT_MAPS}
        <HotSongs />
      {/if}
      {#if $activeView === TOP_RATED_MAPS}
        <TopRatedSongs />
      {/if}
      {#if $activeView === TOP_DOWNLOADED_MAPS}
        <TopDownloadedSongs />
      {/if}
      {#if $activeView === SEARCH}
        <Search />
      {/if}
      {#if $activeView === SETTINGS}
        <Settings />
      {/if}
      {#if $activeView === DOWNLOADS}
        <Downloads />
      {/if}

    </Drawer>
  </div>
  <footer>
    <AudioPlayer />
  </footer>
</div>
