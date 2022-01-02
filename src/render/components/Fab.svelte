<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "svelte-awesome";

  export let scale = 5;
  export let color;
  export let iconColor;
  export let iconData;
  export let iconScale;

  export let disabled = false;
  export let tooltipText = '';

  const dispatch = createEventDispatcher()

  function handleKeyDown(event) {
    if (["Space", "Enter"].includes(event.code)) {
      dispatch('click')
    }
  }
</script>

<div role="button" tabindex=1 class="round-button" style="height:{scale * 8}px; width:{scale * 8}px" on:click on:keydown={handleKeyDown}>
  <div class:disabled  class="round-button-circle" style="--color:{color}; --iconColor:{iconColor}">
    <Icon scale={iconScale} data={iconData} />
  </div>
</div>

<style>
  .round-button-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;

    background: var(--color);
    color: var(--iconColor);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .round-button-circle.disabled {
    filter:grayscale(100%);
  }

  .round-button-circle.disabled:hover {
    filter:grayscale(100%);
  }

  .round-button-circle:not(.disabled):hover {
    background: var(--buttonHoverColor);
  }

  .round-button:hover {
    cursor: pointer;
  }
</style>
