<script>
import TabGroup from "../../components/TabGroup.svelte";

  import { libraryStore } from "../../stores/library.store";
  import SongList from "./SongList.svelte";
import Uploaders from "./Uploaders.svelte";

  function handleScanForSongs() {
    libraryStore.scanForSongs();
  }

  let selectedTab;
</script>

<style>
  
</style>


<div style="height:80px;width:100%;display:flex;flex-direction:column;background-color:var(--background)">
  <input type="text">
  <TabGroup bind:selectedTab/>
  <!-- <div style="display:flex;flex-direction:row;">
    <button style="flex-grow:1;background-color:var(--foreground); color:var(--backgroundText);">Artists</button>
    <button style="flex-grow:1;background-color:var(--foreground); color:var(--backgroundText);">Uploaders</button>
    <button style="flex-grow:1;background-color:var(--foreground); color:var(--backgroundText);">Songs</button>
  </div> -->
</div>
<div style="display: flex; flex-direction: column; height: 100%; overflow-y:auto">
  {#if selectedTab === "Uploaders"}
    <Uploaders />
  {/if}
  <!-- <div>
    <SongList />
  </div> -->
</div>
