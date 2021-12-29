<script>
  import { onMount } from "svelte";
  import { arrowLeft } from "svelte-awesome/icons";
  import { pop } from 'svelte-spa-router';
  import { writable } from "svelte/store";
  import TextButton from "../../../components/TextButton.svelte";
  import SongList from "../SongList.svelte";
  import Icon from "svelte-awesome";

  export let params = {}

  const songsByArtistStore = writable([]);

  onMount(() => {
    window.api.invoke('getSongsByArtist', {artist: params.artist}).then(songs => {
      songsByArtistStore.set(songs);
    });
  });
</script>

<div style="display:flex;flex-direction:row;">
  <TextButton on:click={() => pop()}><Icon data={arrowLeft} scale=.75 /> Back</TextButton>
</div>

<SongList songs={$songsByArtistStore} />