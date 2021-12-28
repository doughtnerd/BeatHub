<script>
  export let isActive = false;
</script>

<style>
  .text-button {
    text-decoration: none;
    border: none;
    background-color: var(--background);
    color:var(--backgroundText);
    box-shadow:none;
  }

  .text-button:hover {
    filter:brightness(200%);
  }

  .text-button.active {
    background-color: var(--foreground);
  }
</style>

<button class:active={isActive} class="text-button" type="button" on:click>
  <slot />
</button>