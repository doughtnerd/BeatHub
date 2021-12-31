<script>
  import Icon from 'svelte-awesome';
  import { undo } from 'svelte-awesome/icons';
  import Router,{ push } from 'svelte-spa-router';
  import TabGroup from "../../components/TabGroup.svelte";
  import TextButton from '../../components/TextButton.svelte';
  import Artist from "./Artists/Artist.svelte";
  import Artists from "./Artists/Artists.svelte";
  import Songs from './Songs/Songs.svelte';
  import Uploader from "./Uploaders/Uploader.svelte";
  import Uploaders from "./Uploaders/Uploaders.svelte";

  let selectedTab;

  const routes = {
    '/': Uploaders,
    '/uploaders': Uploaders,
    '/uploaders/:uploader': Uploader,
    '/artists': Artists,
    '/artists/:artist': Artist,
    '/songs': Songs
  }

  $: {
    switch (selectedTab) {
      case 'Artists':
        push('/library/artists');
        break;
      case 'Uploaders':
        push('/library/uploaders');
        break;
      case 'Songs':
        push('/library/songs');
        break;
    }
  }

  function handleSyncSongLibrary() {
    window.api.invoke('syncSongLibrary').then(() => {
      window.location.reload();
    });
  }
</script>

<style>

  .action-container {
    width:100%;
    display:flex;
    flex-direction:column;
    background-color:var(--background);
    justify-content:flex-end;
  }

  .main-content {
    display: flex; 
    flex-direction: column; 
    height: 100%; 
    overflow-y:auto; 
    padding:16px;
  }
  
</style>

<div class="action-container">
  <TextButton on:click={handleSyncSongLibrary}><Icon data={undo} scale=1 /> Sync Song Library</TextButton>
  <TabGroup bind:selectedTab/>
</div>
<div class="main-content">
  <Router {routes} prefix="/library"/>
</div>
