<script>
  import Icon from "svelte-awesome";
  import { arrowLeft } from "svelte-awesome/icons";
  import Grid from "../../../components/Grid.svelte";
  import LinkButton from "../../../components/LinkButton.svelte";
  import { libraryStore } from "../../../stores/library.store";
  import SongList from "../_shared/SongList.svelte";
  import { derived } from "svelte/store";
  import FullPageCenteredLayout from "../../../components/FullPageCenteredLayout.svelte";

  export let params = {};

  const songsByUploaderStore = derived(libraryStore, ($libraryStore) => {
    return $libraryStore.filter((song) => song.uploader === params.uploader).sort((a, b) => a.song_title.localeCompare(b.song_title));
  });
</script>

<Grid columns="1fr 1fr 1fr">
  <LinkButton style="place-self:center start;" to="/library/uploaders"><Icon data={arrowLeft} scale=".75" /> Back</LinkButton>
  <h3 class="uploader-name">{params.uploader}</h3>
</Grid>

{#if $songsByUploaderStore.length > 0}
  <SongList songs={$songsByUploaderStore} on:delete={(event) => libraryStore.deleteSong(event.detail.song)} />
{:else}
  <FullPageCenteredLayout>
    <h1>No Songs Found</h1>
  </FullPageCenteredLayout>
{/if}

<style>
  .uploader-name {
    place-self: center;
  }
</style>
