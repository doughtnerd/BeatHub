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

  let buttonContainer;
  let buttonIconContainer;

  $: {
    if(buttonContainer) {
      buttonContainer.style.height = `${scale * 8}px`;
      buttonContainer.style.width = `${scale * 8}px`;
    }
  }

  $: {
    if(buttonIconContainer) {
      buttonIconContainer.style.setProperty('--color', color);
      buttonIconContainer.style.setProperty('--iconColor', iconColor);
    }
  }

  const dispatch = createEventDispatcher()

  function handleKeyDown(event) {
    if (["Space", "Enter"].includes(event.code)) {
      dispatch('click')
    }
  }
</script>

<div bind:this={buttonContainer} role="button" tabindex=0 class="round-button" on:click on:keydown={handleKeyDown}>
  <div bind:this={buttonIconContainer} class:disabled  class="round-button-circle">
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
