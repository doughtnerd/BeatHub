<script>
  import { fly } from "svelte/transition";
  import { errorsStore } from "../stores/errors.store";

  const inSettings = {
    y: -200,
    duration: 500
  };

  const outSettings = {
    y: -200,
    duration: 500
  };
</script>

<style>
  .notification {
    position: fixed;
    top: 0;
    left: 0;

    padding: 8px;
    width: 100%;
    text-align: center;

    background-color: var(--error);
    color: white;
  }
</style>

{#if $errorsStore.isShowing}
  <div in:fly={inSettings} out:fly={outSettings} class="notification">
    {$errorsStore.message}
  </div>
{/if}
