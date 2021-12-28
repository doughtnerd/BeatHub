<script>
  import { onMount } from 'svelte';

  import {writable} from 'svelte/store';

  const uploadersStore = writable([]);

  onMount(() => {
    window.api.invoke('getUploaders').then(uploaders => {
      console.log(uploaders);
      uploadersStore.set(uploaders.map(u => u.uploader));
    });
  });
</script>

{#each $uploadersStore as uploader}
  <div>{uploader}</div>
{/each}