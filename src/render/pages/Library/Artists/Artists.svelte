<script>
  import FullPageCenteredLayout from "../../../components/FullPageCenteredLayout.svelte";
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
  <FullPageCenteredLayout>
    <h1>No artists found</h1>
  </FullPageCenteredLayout>
{/if}
