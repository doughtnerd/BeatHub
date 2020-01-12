<script>
  import { downloads } from "../stores/downloads.store";

  function handleOnChange(event) {
    if (event.target.files[0] && event.target.files[0].path) {
      downloads.changeDownloadDirectory(event.target.files[0].path);
    }
  }
</script>

<div>
  {$downloads.downloadDirectory}
  <label>
    Choose Folder
    <input
      type="file"
      style="visibility: hidden;"
      webkitdirectory
      on:change={handleOnChange} />
  </label>
</div>
