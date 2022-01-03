<script>
  export let isActive = false;
  export let style = '';

  let buttonEl;

  $: {
    if(buttonEl) {
      buttonEl.style.cssText = style;
    }
  }
</script>

<style>
  .text-button {
    text-decoration: none;
    border: none;
    background-color: var(--background);
    color:var(--backgroundText);
    box-shadow:none;
    border-radius: none;
    justify-content: center;
    align-items: center;
    margin: 0;
  }

  .text-button:hover {
    background-color: var(--buttonHoverColor);
  }

  .text-button.active {
    background-color: var(--foreground);
  }
</style>

<button bind:this={buttonEl} class:active={isActive} class="text-button" type="button" on:click>
  <slot />
</button>