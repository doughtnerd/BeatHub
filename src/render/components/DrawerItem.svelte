<script>
  import Icon from "svelte-awesome";
  import { tooltip } from "../actions/tooltip";

  export let isActive;
  export let itemName;
  export let icon;
</script>

<style>
  .drawer-item {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 72px;
    width: 100%;

    color: var(--backgroundText);
  }

  .drawer-item:hover {
    background-color: var(--buttonHoverColor);
    cursor: pointer;
  }

  .drawer-item:active,
  .drawer-item.active {
    background-color: var(--foreground);
    color: var(--primary);
  }
</style>

<div
  class="drawer-item"
  class:active={isActive}
  use:tooltip={{ text: itemName }}
  on:click>
  <Icon scale={2} data={icon} />

  <slot />
</div>
