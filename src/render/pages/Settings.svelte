<script>
  import PrimaryText from "../components/PrimaryText.svelte";
  import { settingsStore } from '../stores/settings.store';
  import { availableThemesStore,themeStore } from "../stores/theme.store";

  function handleChangeDirectory(event) {
    settingsStore.changeBeatSaberDirectory();
  }

  function handleThemeChange(event) {
    const theme = event.target.value;
    themeStore.setTheme(theme);
  }
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
  
  <PrimaryText>
    <h1>App Version</h1>
  </PrimaryText>
  <div>
    <span>{$settingsStore.appVersion}</span>
  </div>

  <PrimaryText>
    <h1>Beat Saber Install Location</h1>
  </PrimaryText>
  <div class="folder-selection-area">
    <span>Current Location: {$settingsStore.beatSaberDirectory}</span>
    <div class="folder-selection-buttons">

      <button
        class="primary"
        id="folder-selection"
        type="button"
        tabindex="0"
        on:click={handleChangeDirectory}>
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
