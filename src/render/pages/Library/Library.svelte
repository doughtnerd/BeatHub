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
  import Dialog from '../../components/Dialog.svelte';

  import { writable } from 'svelte/store';

  const dialogOpen = writable(false)

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

  function handleConfirmDialog(shouldSync) {
    if (shouldSync) {
      libraryStore.sync();
    }
    dialogOpen.set(false);
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
  <TextButton on:click={() => dialogOpen.set(true)}><Icon data={undo} scale=1 /> Sync Song Library</TextButton>
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

{#if $dialogOpen}
<Dialog height="400px" width="400px">
  <h1 slot="dialog-header">Sync Song Library</h1>
  <div slot="dialog-content">
    
    <p>Are you sure you want to sync the song library?</p>
    <p>
      Use this only if you have songs downloaded already and would like to manage them using this app.
    </p>
    <p>
      This will scan your Beat Saber installation directory for new songs and update the library accordingly.
      You should be able to use the app normally but it could take a minute for the process to complete.
    </p>
    <p>
      Songs added to your library this way won't have their Beat Saver data synced. Meaning you won't be able to load the
      visual preview and the song won't be marked as 'downloaded' when browsing/searching songs. To fix this, just delete the song
      and download it again using this app.
    </p>
  </div>
  <svelte:fragment slot="dialog-actions">
    <button type="button" on:click={() => handleConfirmDialog(true)}>Yes</button>
    <button type="button" on:click={() => handleConfirmDialog(false)}>No</button>
  </svelte:fragment>
</Dialog>
{/if}