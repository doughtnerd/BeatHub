<script>
  import {link} from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  export let to = '';
</script>

<style>
  .link-button {
    text-decoration: none;
    padding: 8px 16px;
  }

  .link-button:hover {
    filter: brightness(1.5);
  }
</style>

<a href={to} use:link use:active class="link-button">
  <slot />
</a>