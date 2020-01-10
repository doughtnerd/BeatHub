<script>
  import { previewUrl, beatmapPreview } from "../stores/beatmap-preview.store";

  function handleEnded() {
    beatmapPreview.stop();
  }
</script>

<style>
  div {
    background-color: #f2f3f4;
  }

  audio {
    width: 400px;
  }
</style>

<div>
  <audio
    autoplay
    controls
    controlsList="nodownload"
    src={$previewUrl}
    on:ended={handleEnded} />
</div>
