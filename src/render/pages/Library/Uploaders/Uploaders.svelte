<script>
  import FullPageCenteredLayout from "../../../components/FullPageCenteredLayout.svelte";
  import LinkButton from "../../../components/LinkButton.svelte";
  import List from "../../../components/List.svelte";
  import { uploadersStore } from "../../../stores/library.store";
</script>

{#if $uploadersStore.length > 0}
  <List>
    {#each $uploadersStore as uploader}
      <LinkButton style="border-radius:8px;text-align:left;" to={`/library/uploaders/${encodeURIComponent(uploader)}`}
        >{uploader}</LinkButton
      >
    {/each}
  </List>
{:else}
  <FullPageCenteredLayout>
    <h1>No Uploaders Found</h1>
  </FullPageCenteredLayout>
{/if}