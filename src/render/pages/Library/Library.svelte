<script>
  import { onMount } from 'svelte';
  import Icon from 'svelte-awesome';
  import { undo } from 'svelte-awesome/icons';
  import Router,{ push } from 'svelte-spa-router';
  import LinkButton from '../../components/LinkButton.svelte';
  import TextButton from '../../components/TextButton.svelte';
  import { libraryStore } from '../../stores/library.store';
  import Artist from "./Artists/Artist.svelte";
  import Artists from "./Artists/Artists.svelte";
  import Songs from './Songs/Songs.svelte';
  import Uploader from "./Uploaders/Uploader.svelte";
  import Uploaders from "./Uploaders/Uploaders.svelte";

  onMount(() => {
    push('/library/artists');
  })

  const routes = {
    '/uploaders': Uploaders,
    '/uploaders/:uploader': Uploader,
    '/artists': Artists,
    '/artists/:artist': Artist,
    '/songs': Songs
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

  :global(.library-active-tab) {
    background-color:var(--foreground) !important;
  }

  .library-nav {
    display:flex;
    flex-direction:row;
    align-items:stretch;
  }
  
</style>

<header class="action-container">
  <TextButton on:click={() => libraryStore.sync()}><Icon data={undo} scale=1 /> Sync Song Library</TextButton>
  <nav class="library-nav">
    <LinkButton activeConfig={{path:/\/library\/artists.*/, className:'library-active-tab'}} style="flex-grow:1;" to="/library/artists">
      Artists
    </LinkButton>

    <LinkButton activeConfig={{path:/\/library\/uploaders.*/, className:'library-active-tab'}} style="flex-grow:1;" to="/library/uploaders">
      Uploaders
    </LinkButton>

    <LinkButton activeConfig={{path:/\/library\/songs.*/, className:'library-active-tab'}} style="flex-grow:1;" to="/library/songs">
      Songs
    </LinkButton>
  </nav>
</header>

<div class="main-content">
  <Router {routes} prefix="/library"/>
</div>
