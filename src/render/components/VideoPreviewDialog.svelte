<script>
  import Dialog from "./Dialog.svelte";

  import { beatmapVideoPreviewStore } from "../stores/beatmap-video-preview.store";

  const handleBackgroundClick = () => {
    beatmapVideoPreviewStore.stop();
  };
</script>

<style>
  .beatmap-preview-iframe {
    width:100%; 
    height:100%;
  }
</style>

{#if $beatmapVideoPreviewStore !== null}
  <Dialog on:backgroundClick={handleBackgroundClick} height="400px" width="800px">
    <iframe
      class="beatmap-preview-iframe"
      slot="dialog-content"
      title="Beat Saber Preview"
      src="https://skystudioapps.com/bs-viewer/?id={$beatmapVideoPreviewStore}"
      frameborder="0"
    />
  </Dialog>
{/if}
