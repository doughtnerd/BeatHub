<script>
  import { createEventDispatcher } from "svelte";

  export let mode = "standard";

  export let height = "200px";
  export let width = "400px";

  let dialogEl;

  $: {
    if(dialogEl) {
      dialogEl.style.height = height;
      dialogEl.style.width = width;
    }
  }

  $: hasBackdrop = mode === "standard";

  const dispatch = createEventDispatcher();

  const handleBackgroundClick = () => {
    dispatch("backgroundClick");
  };
</script>

<div class="dialog-container" on:click={handleBackgroundClick} class:backdrop={hasBackdrop}>
  <div bind:this={dialogEl} class="dialog">
    <slot name="dialog-header"/>
    <div class="dialog-content">
      <slot name="dialog-content" />
    </div>

    <div class="dialog-actions">
      <slot name="dialog-actions" />
    </div>
  </div>
</div>

<style>
  .dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    z-index: 3;
  }

  .backdrop {
    background-color: rgba(0, 0, 0, 0.75);
  }

  .dialog {
    background-color: var(--foreground);
    padding: 16px;

    display: flex;
    flex-direction: column;
  }

  .dialog-content {
    flex-grow: 2;
    overflow-y: scroll;
  }

  .dialog-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
</style>
