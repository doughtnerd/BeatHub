<script>
  import {
    LOAD_LIBRARY
  } from "../../constants/channelNames";
  import LoadingScreen from "../components/LoadingScreen.svelte";
  import Fab from '../components/Fab.svelte'
  import { play, trash } from "svelte-awesome/icons";

  const loadLib = window.api.invoke(LOAD_LIBRARY);
</script>

<style>
  .library-tile {
    display: flex;
    padding: 8px;
    flex-direction: row;
    justify-content: space-between;
    border-radius: 16px;
    background: rgba(0,0,0,.33);
    /* width:fit-content; */
  }

  .library-tile > img {
    width: 64px;
    height: 64px;
    border-radius: 16px;
  }
</style>

{#await loadLib}
  <LoadingScreen />
{:then lib}

<div style="padding:32px">
  {#each lib as libSong}

    <div class="library-tile">
      <img src={libSong.disk_location + '/cover.png'} alt="">
      <div style="display:flex;flex-direction:column;justify-content:center; align-items:center">
        <span>{libSong.song_title} - {libSong.song_author}</span>
        <sub>Uploaded By: {libSong.uploader}</sub>
      </div>
      <div style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;flex-grow:.033;">
        <Fab on:click={() => {}} scale={6} iconColor="white" color="var(--primary)" iconData={play} iconScale={1.5} />
        <Fab on:click={() => {}} scale={6} iconColor="white" color="var(--error)" iconData={trash} iconScale={1.5} />
      </div>
    </div>

  {/each}
</div>

{:catch error}
{console.log(error)}
{/await}
