<script>
import TextButton from "./TextButton.svelte";



  export let tabs = ["Artists", "Uploaders", "Songs"]

  export let selectedTab = "Artists"

  function handleTabClick(tab) {
    selectedTab = tab
  }
</script>

<style>

  .toggle-group {
    display:flex;
    flex-direction: row;
    align-items: stretch;
  }
  
  :global(.toggle-group > *) {
    flex: 1;
    height:100%;
  }

</style>

<div class="toggle-group">
  {#each tabs as tab}
    <!-- <button class:toggled={tab===selectedTab} class="text-button" type="button" on:click={() => handleTabClick(tab)}>{tab}</button> -->
    <TextButton isActive={tab===selectedTab} on:click={() => handleTabClick(tab)}>
      {tab}
    </TextButton>
  {/each}
</div>