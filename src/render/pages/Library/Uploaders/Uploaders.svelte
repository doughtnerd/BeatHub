<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import LinkButton from '../../../components/LinkButton.svelte';

  const uploadersStore = writable([]);

  onMount(() => {
    window.api.invoke('getUploaders').then(uploaders => {
      uploadersStore.set(uploaders.map(u => u.uploader));
    });
  });
</script>

<div style="display:flex;flex-direction:column;">
  {#each $uploadersStore as uploader}
    <LinkButton to={`/library/uploaders/${uploader}`}>{uploader}</LinkButton>
  {/each}
</div>