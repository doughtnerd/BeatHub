<script>
  import {link} from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let to = '';
  export let style = '';
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

<a {style} href={to} use:link use:active class="link-button">
  <slot />
</a>