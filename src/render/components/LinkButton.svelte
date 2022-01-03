<script>
  import {link} from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let to = '';
  export let style = '';
  export let activeConfig = null;
  
  let buttonEl;
  $: {
    if (buttonEl) {
      buttonEl.style.cssText = style
    }
  }
</script>

<style>
  .link-button {
    text-decoration: none;
    padding: 8px 16px;
    background-color: var(--background);
    color:var(--backgroundText);
    text-align: center;
  }
  .link-button:hover {
    background-color: var(--buttonHoverColor);
  }

  .link-button:active {
    background-color: var(--foreground);
  }
</style>

{#if activeConfig}
  <a bind:this={buttonEl} href={to} use:link use:active={activeConfig} class="link-button"><slot /></a>
{:else}
  <a bind:this={buttonEl} href={to} use:link use:active class="link-button"><slot /></a>
{/if}