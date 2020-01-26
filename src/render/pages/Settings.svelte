<script>
  import PrimaryText from "../components/PrimaryText.svelte";
  import { downloads } from "../stores/downloads.store";
  import { appInfoStore } from "../stores/app-info.store";
  import { availableThemesStore, themeStore } from "../stores/theme.store";

  function handleOnChange(event) {
    if (event.target.files[0] && event.target.files[0].path) {
      downloads.changeDownloadDirectory(event.target.files[0].path);
    }
  }

  function handleThemeChange(event) {
    const theme = event.target.value;
    themeStore.setTheme(theme);
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

<div class="container">
  <input
    bind:this={installLocInput}
    type="file"
    style="display: none"
    webkitdirectory
    on:change={handleOnChange} />
  <PrimaryText>
    <h1>App Version</h1>
  </PrimaryText>
  <div>
    <span>{$appInfoStore.appVersion}</span>
  </div>

  <PrimaryText>
    <h1>Beat Saber Install Location</h1>
  </PrimaryText>
  <div class="folder-selection-area">
    <span>Current Location: {$downloads.downloadDirectory}</span>
    <div class="folder-selection-buttons">

      <button
        class="primary"
        id="folder-selection"
        on:click={() => {
          installLocInput.click();
        }}>
        Choose Location
      </button>
    </div>
  </div>

  <PrimaryText>
    <h1>Theme</h1>
  </PrimaryText>
  <div class="theme-selection">
    <select on:change={handleThemeChange} value={$themeStore.currentThemeName}>
      {#each $availableThemesStore as theme}
        <option value={theme}>{theme}</option>
      {/each}
    </select>
  </div>
</div>
