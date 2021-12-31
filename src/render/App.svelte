<script>
  import { book,cog,exclamation,search,star,tasks } from "svelte-awesome/icons";
  import Router,{ location,push } from 'svelte-spa-router';
  import AudioPlayer from "./components/AudioPlayer.svelte";
  import Badge from "./components/Badge.svelte";
  import Drawer from "./components/Drawer.svelte";
  import DrawerItem from "./components/DrawerItem.svelte";
  import ErrorNotificationBar from "./components/ErrorNotificationBar.svelte";
import Scrollbar from "./components/Scrollbar.svelte";
  import Toast from "./components/Toast.svelte";
  import VideoPreviewDialog from "./components/VideoPreviewDialog.svelte";
  import Downloads from "./pages/Downloads.svelte";
  import Library from "./pages/Library/Library.svelte";
  import NewSongs from "./pages/NewSongs.svelte";
  import Search from "./pages/Search.svelte";
  import Settings from "./pages/Settings.svelte";
  import TopRatedSongs from "./pages/TopRatedSongs.svelte";
  import UpdateReadyDialog from "./pages/UpdateReadyDialog.svelte";
  import { numberOfDownloads } from "./stores/downloads.store";
  import { themeStore } from "./stores/theme.store";

  const routes = {
    '/': Search,
    '/search': Search,
    '/top': TopRatedSongs,
    '/new': NewSongs,
    '/library': Library,
    '/library/*': Library,
    '/downloads': Downloads,
    '/settings': Settings
  };
</script>

<div class="app-container">
  <div class="main">
    <Drawer mode="slim">
      <div class="drawer-content" slot="drawer-content">
        <DrawerItem
          itemName="Search"
          isActive={$location === '/search'}
          icon={search}
          on:click={() => {
            push('/search');
          }}
        />
        <DrawerItem
          itemName="Top Rated"
          isActive={$location === '/top'}
          icon={star}
          on:click={() => {
            push('/top');
          }}
        />
        <DrawerItem
          itemName="New Maps"
          isActive={$location === '/new'}
          icon={exclamation}
          on:click={() => {
            push('/new');
          }}
        />
        <DrawerItem
          itemName="Library"
          isActive={$location.includes('/library')}
          icon={book}
          on:click={() => {
            push('/library');
          }}
        />
        <DrawerItem
          itemName="Downloads"
          isActive={$location === '/downloads'}
          icon={tasks}
          on:click={() => {
            push('/downloads');
          }}
        >
          <div style="position: absolute; left: 8px;">
            <Badge color="white" background="var(--error)">
              <span>{$numberOfDownloads}</span>
            </Badge>
          </div>
        </DrawerItem>
        <DrawerItem
          itemName="Settings"
          isActive={$location === '/settings'}
          icon={cog}
          on:click={() => {
            push('/settings');
          }}
        />
      </div>

      <Router {routes} />
      
    </Drawer>
  </div>
  <footer>
    <AudioPlayer />
  </footer>
</div>

<ErrorNotificationBar />

<UpdateReadyDialog />

<Toast />

<VideoPreviewDialog />

<Scrollbar />

<svelte:head>
  <link rel="stylesheet" href={$themeStore.currentThemeCss} />
</svelte:head>

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
    overflow-y: scroll;
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
