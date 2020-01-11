<script>
  import { downloads } from "../stores/downloads.store";

  function handleOnChange(event) {
    console.log(event.target.files[0].path);
  }
</script>

<div>
  {$downloads.downloadDirectory}
  <input
    type="file"
    id="dl-location"
    webkitdirectory=""
    on:change={handleOnChange} />
</div>
