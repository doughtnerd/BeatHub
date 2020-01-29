<script>
  import Dialog from "../components/Dialog.svelte";
  import { createEventDispatcher } from "svelte";
  import { updateDialogStore } from "../stores/update-ready-dialog.store";

  function handleYesClicked() {
    updateDialogStore.updateAndRestart();
  }

  function handleNoClicked() {
    updateDialogStore.close();
  }
</script>

<style>
  .dialog-content {
    color: var(--backgroundText);
  }
</style>

{#if $updateDialogStore.isOpen}
  <Dialog>
    <div class="dialog-content" slot="dialog-content">
      <h1>Update Ready</h1>
      <div>
        <p>An update is ready. Do you want to restart and update?</p>
      </div>
    </div>
    <div slot="dialog-actions">
      <button on:click={handleYesClicked}>Yes</button>
      <button on:click={handleNoClicked}>No</button>
    </div>
  </Dialog>
{/if}
