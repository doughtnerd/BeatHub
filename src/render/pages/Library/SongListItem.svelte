<script>
  import { createEventDispatcher } from "svelte";
  import { trash } from "svelte-awesome/icons";
  import Fab from '../../components/Fab.svelte';

  export let song;

  const dispatch = createEventDispatcher();

  export function handleDeleteClick() {
    dispatch("delete", { song });
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

<div class="library-tile">
  <img src={`${song.disk_location}/${song.cover_filename}`} alt="">
  <div style="display:flex;flex-direction:column;justify-content:center; align-items:center;padding: 0px 8px 0 8px">
    <span>{song.song_title}</span>
    <span>{song.song_author}</span>
    <sub>Uploaded By: {song.uploader}</sub>
  </div>
  <div style="display:flex;flex-direction:row;justify-content:space-between;">
    <Fab on:click={handleDeleteClick} scale={6} iconColor="white" color="var(--error)" iconData={trash} iconScale={1.5} />
  </div>
</div>