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
  import Tooltip from "./components/Tooltip.svelte";
  import UpdateReadyDialog from "./pages/UpdateReadyDialog.svelte";
  import DrawerItem from "./components/DrawerItem.svelte";
  import { downloads } from "./stores/downloads.store";
  import { themeStore } from "./stores/theme.store";

  $: numberOfDownloads = Object.keys($downloads.downloading).length;
</script>

<style>
  .app-container {
    height: 100vh;
    width: 100vw;

    display: flex;
    flex-direction: column;
  }

  .drawer-content {
    position: static;
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
        <DrawerItem
          itemName={SEARCH}
          currentActiveView={$activeView}
          icon={search}
          on:click={() => {
            activeView.set(SEARCH);
          }} />
        <DrawerItem
          itemName={TOP_RATED_MAPS}
          currentActiveView={$activeView}
          icon={star}
          on:click={() => {
            activeView.set(TOP_RATED_MAPS);
          }} />
        <DrawerItem
          itemName={TOP_DOWNLOADED_MAPS}
          currentActiveView={$activeView}
          icon={arrowCircleDown}
          on:click={() => {
            activeView.set(TOP_DOWNLOADED_MAPS);
          }} />
        <DrawerItem
          itemName={HOT_MAPS}
          currentActiveView={$activeView}
          icon={fire}
          on:click={() => {
            activeView.set(HOT_MAPS);
          }} />
        <DrawerItem
          itemName={NEW_MAPS}
          currentActiveView={$activeView}
          icon={exclamation}
          on:click={() => {
            activeView.set(NEW_MAPS);
          }} />
        <DrawerItem
          itemName={DOWNLOADS}
          currentActiveView={$activeView}
          icon={tasks}
          on:click={() => {
            activeView.set(DOWNLOADS);
          }}>
          <div style="position: absolute; left: 8px;">
            <Badge color="white" background="var(--error)">
              <span>{numberOfDownloads}</span>
            </Badge>
          </div>
        </DrawerItem>
        <DrawerItem
          itemName={SETTINGS}
          currentActiveView={$activeView}
          icon={cog}
          on:click={() => {
            activeView.set(SETTINGS);
          }} />
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
<UpdateReadyDialog />

<svelte:head>
  <link rel="stylesheet" href={$themeStore.currentThemeCss} />
</svelte:head>
