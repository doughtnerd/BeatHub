<script>
  import PrimaryText from "../components/PrimaryText.svelte";
  import { downloads } from "../stores/downloads.store";
  const appVersion = require('electron').remote.app.getVersion();
  function handleOnChange(event) {
    if (event.target.files[0] && event.target.files[0].path) {
      downloads.changeDownloadDirectory(event.target.files[0].path);
    }
  }

  let installLocInput;
</script>

<style>
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }

  .folder-selection-area {
    display: flex;
    flex-direction: column;
  }

  .folder-selection-buttons {
    display: flex;
    flex-direction: row;

    margin-top: 24px;
  }

  .folder-selection-area > * {
    margin-right: 16px;
  }

  #folder-selection {
    border: none;
  }
</style>

<input
  bind:this={installLocInput}
  type="file"
  style="visibility: hidden;"
  webkitdirectory
  on:change={handleOnChange} />

<div class="container">
  <PrimaryText><h1>App Version</h1></PrimaryText>
  <div><span>{appVersion}</span></div>
  <PrimaryText>
    <h1>Beat Saber Install Location</h1>
  </PrimaryText>
  <div class="folder-selection-area">
    <span>Current Location: {$downloads.downloadDirectory}</span>
    <div class="folder-selection-buttons">

      <button
        id="folder-selection"
        on:click={() => {
          installLocInput.click();
        }}>
        Choose Location
      </button>
    </div>
  </div>
</div>
