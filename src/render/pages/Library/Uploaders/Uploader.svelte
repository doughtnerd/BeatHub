<script>
  import { onMount } from "svelte";
  import { pop } from 'svelte-spa-router';
  import { writable } from "svelte/store";
  import TextButton from "../../../components/TextButton.svelte";
  import SongList from "../SongList.svelte";
  import Icon from 'svelte-awesome'
import { arrowLeft } from "svelte-awesome/icons";

  export let params = {}

  const songsByUploaderStore = writable([]);

  onMount(() => {
    window.api.invoke('getSongsByUploader', {uploader: params.uploader}).then(songs => {
      songsByUploaderStore.set(songs);
    });
  });
</script>

<div style="display:flex;flex-direction:row;">
  <TextButton on:click={() => pop()}><Icon data={arrowLeft} scale=.75 /> Back</TextButton>
</div>

<SongList songs={$songsByUploaderStore} />