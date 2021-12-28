<script>
  import { onMount } from "svelte";
  import { trash } from "svelte-awesome/icons";
  import Fab from '../../components/Fab.svelte';
  import List from '../../components/List.svelte';
  import { libraryStore } from "../../stores/library.store";

  onMount(() => {
    libraryStore.loadLibrary();
  });

  function handleDeleteSong(key, name) {
    libraryStore.deleteSong(key, name);
  }

  function handleScanForSongs() {
    libraryStore.scanForSongs();
  }
</script>

<style>
  .library-tile {
    display: flex;
    padding: 8px;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 16px;
    background: rgba(0,0,0,.33);
    align-items: center;
  }

  .library-tile > img {
    width: 64px;
    height: 64px;
    border-radius: 12px;
  }
</style>


<List>
  {#each $libraryStore as libSong}

    <div class="library-tile">
      <img src={`${libSong.disk_location}/${libSong.cover_filename}`} alt="">
      <div style="display:flex;flex-direction:column;justify-content:center; align-items:center">
        <span>{libSong.song_title} - {libSong.song_author}</span>
        <sub>Uploaded By: {libSong.uploader}</sub>
      </div>
      <div style="display:flex;flex-direction:row;justify-content:space-between;">
        <!-- <Fab on:click={() => {}} scale={6} iconColor="white" color="var(--primary)" iconData={play} iconScale={1.5} /> -->
        <Fab on:click={() => handleDeleteSong(libSong.key, libSong.song_title)} scale={6} iconColor="white" color="var(--error)" iconData={trash} iconScale={1.5} />
      </div>
    </div>

  {/each}
</List>
