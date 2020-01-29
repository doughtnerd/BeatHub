<script>
  import { fly } from "svelte/transition";
  import { toastStore } from "../stores/toast.store";

  const inSettings = {
    y: 200,
    duration: 500
  };

  const outSettings = {
    y: 200,
    duration: 500
  };
</script>

<style>
  .toast {
    position: fixed;
    bottom: 64px;
    left: 50%;
    transform: translate(-50%, 0);

    padding: 8px;
    min-width: 124px;
    text-align: center;
    border-radius: 8px;

    background-color: var(--toastBackgroundColor);
    color: var(--toastTextColor);
  }
</style>

{#if $toastStore.isShowing}
  <div in:fly={inSettings} out:fly={outSettings} class="toast">
    {$toastStore.message}
  </div>
{/if}
