<script>
  import { writable } from "svelte/store";
  import Dialog from "../../components/Dialog.svelte";
  import { modsStore } from "../../stores/mods.store";
  import ModTable from "./components/ModTable.svelte";

  const uninstallErrorMessageStore = writable("");

  function handleInstallMod(event) {
    modsStore.installMod(event.detail);
  }

  function handleUnInstallMod(event) {
    modsStore.uninstallMod(event.detail).catch((error) => {
      uninstallErrorMessageStore.set(error.message);
    });
  }
</script>

<div class="main-content">
  <ModTable on:installMod={handleInstallMod} on:uninstallMod={handleUnInstallMod} mods={$modsStore} />
</div>

{#if $uninstallErrorMessageStore}
  <Dialog height="400px" width="800px">
    <h1 slot="dialog-header">Error Uninstalling Mod</h1>
    <div class="dialog-content" slot="dialog-content">
      <div>
        <p>
          Cannot uninstall the selected mod. Likely because other mods depend on it. Please uninstall the following mods before trying to
          uninstall this mod.
        </p>
        <p>Sorry, working on this error reporting feature. Be prepared for the full error message in all it's gross glory.</p>
        <p>
          <strong>{$uninstallErrorMessageStore}</strong>
        </p>
      </div>
    </div>
    <div slot="dialog-actions">
      <button on:click={() => uninstallErrorMessageStore.set("")}>Ok</button>
    </div>
  </Dialog>
{/if}

<style>
  .main-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
  }
</style>
