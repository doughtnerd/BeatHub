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

  function handleScanForSongs() {
    window.api.invoke('syncSongLibrary').then(() => {
      window.location.reload();
    });
  }
</script>

<style>
  
</style>

<div style="height:80px;width:100%;display:flex;flex-direction:column;background-color:var(--background);justify-content:flex-end">
  <TextButton on:click={handleScanForSongs}><Icon data={undo} scale=1 /> Scan For Songs</TextButton>
  <TabGroup bind:selectedTab/>
</div>
<div style="display: flex; flex-direction: column; height: 100%; overflow-y:auto; padding:16px">
  <Router {routes} prefix="/library"/>
</div>
