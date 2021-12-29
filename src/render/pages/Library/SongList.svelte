<script>
  import List from '../../components/List.svelte';
  import SongListItem from "./SongListItem.svelte";

  export let songs = []
</script>

<List>
  {#each songs as song}
    <SongListItem {song} on:delete />
  {/each}
</List>
