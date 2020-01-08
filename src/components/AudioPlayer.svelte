<script>
  import { previewUrl } from "../stores/beatmap-preview.store";
</script>

<style>
  div {
    box-shadow: 0 0 3px 2px rgba(0, 0, 0, 0.25);
    background-color: #f2f3f4;
  }

  audio {
    width: 400px;
  }
</style>

<div>
  <audio autoplay controls controlsList="nodownload" src={$previewUrl} />
</div>
