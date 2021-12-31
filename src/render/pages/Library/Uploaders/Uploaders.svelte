<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LinkButton from '../../../components/LinkButton.svelte';
  import List from '../../../components/List.svelte';
  import LoadingScreen from '../../../components/LoadingScreen.svelte';

  const uploadersStore = writable([]);

  onMount(() => {
    uploadersStore.set(
      window.api.invoke('getUploaders')
        .then(uploaders => uploaders.map(u => u.uploader))
        .catch(() => [])
    );
  });
</script>

{#await $uploadersStore}
  <LoadingScreen />
{:then uploaders}
  {#if uploaders.length > 0}
    <List>
      {#each uploaders as uploader}
        <LinkButton style="border-radius:8px;text-align:left;"  to={`/library/uploaders/${uploader}`}>{uploader}</LinkButton>
      {/each}
    </List>
  {:else}
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <h1>No Uploaders Found</h1>
    </div>
  {/if}
{/await}