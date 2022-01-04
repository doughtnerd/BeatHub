<script>
  import LinkButton from "../../../components/LinkButton.svelte";
  import List from "../../../components/List.svelte";
  import { artistsStore } from "../../../stores/library.store";
</script>

{#if $artistsStore.length > 0}
  <List>
    {#each $artistsStore as artist}
      <LinkButton style="border-radius:8px;text-align:left;" to={`/library/artists/${encodeURIComponent(artist)}`}>{artist}</LinkButton>
    {/each}
  </List>
{:else}
  <div class="no-artists-display">
    <h1>No Artists Found</h1>
  </div>
{/if}

<style>
  .no-artists-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
</style>
