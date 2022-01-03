<script>
  import Icon from "svelte-awesome";
  import { arrowLeft } from "svelte-awesome/icons";
  import Grid from '../../../components/Grid.svelte';
  import LinkButton from "../../../components/LinkButton.svelte";
  import { libraryStore } from "../../../stores/library.store";
  import SongList from "../_shared/SongList.svelte";
  import { derived } from "svelte/store";

  export let params = {}

  const songsByArtistStore = derived(libraryStore, ($libraryStore) => {
    return $libraryStore.filter((song) => song.song_author === params.artist).sort((a, b) => a.song_title.localeCompare(b.song_title));
  })

</script>

<Grid columns="1fr 1fr 1fr">
  <LinkButton style="place-self:center start;" to="/library/artists"><Icon data={arrowLeft} scale=.75 /> Back</LinkButton>
  <h3 style="place-self:center">{params.artist}</h3>
</Grid>

{#if $songsByArtistStore.length > 0}
  <SongList songs={$songsByArtistStore} on:delete={(event) => libraryStore.deleteSong(event.detail.song)} />
{:else}
  <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
    <h1>No Songs Found</h1>
  </div>
{/if}