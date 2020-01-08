<script>
  import Drawer from "./components/Drawer.svelte";
  import Icon from "svelte-awesome";
  import {
    playCircle,
    stopCircle,
    search,
    music,
    book,
    fire,
    star
  } from "svelte-awesome/icons";

  import NewSongs from "./pages/NewSongs.svelte";
  import AudioPlayer from "./components/AudioPlayer.svelte";
</script>

<style>
  .drawer-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>

<Drawer>
  <div class="drawer-content" slot="drawer-content">
    <Icon scale={3} data={music} />
    <Icon scale={3} data={fire} />
    <Icon scale={3} data={book} />
    <Icon scale={3} data={search} />
    <Icon scale={3} data={star} />
  </div>
  <NewSongs />
</Drawer>

<div
  style="position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);">
  <AudioPlayer />
</div>
