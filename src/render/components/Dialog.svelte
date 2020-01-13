<script>
  export let mode = "standard";

  $: hasBackdrop = mode === "standard";
</script>

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
  }

  .backdrop {
    background-color: rgba(0, 0, 0, 0.75);
  }

  .dialog {
    background-color: var(--foreground);
    padding: 16px;
    box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.25);
    width: 400px;
    height: 200px;

    display: flex;
    flex-direction: column;
  }

  .dialog-content {
    flex-grow: 2;
  }

  .dialog-actions {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>

<div class="dialog-container" class:backdrop={hasBackdrop}>
  <div class="dialog">
    <div class="dialog-content">
      <slot name="dialog-content" />
    </div>

    <div class="dialog-actions">
      <slot name="dialog-actions" />
    </div>
  </div>
</div>
