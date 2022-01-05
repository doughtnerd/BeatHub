<script>
  import { fly } from "svelte/transition";
  import { errorsStore } from "../stores/errors.store";

  const inSettings = {
    y: -300,
    duration: 500
  };

  const outSettings = {
    y: -300,
    duration: 500
  };
</script>

<style>
  .notification {
    position: absolute;
    top: 0;
    left: 0;

    padding: 8px;
    width: 100%;
    text-align: center;

    background-color: var(--error);
    color: white;

    z-index: 2;
  }
</style>

{#if $errorsStore}
  <div in:fly={inSettings} out:fly={outSettings} class="notification">
    {$errorsStore}
  </div>
{/if}
