<script>
  export let color;
  export let background;

  let badgeEl;

  $: {
    if(badgeEl) {
      badgeEl.style.setProperty('--color', color);
      badgeEl.style.setProperty('--background', background);
    }
  }
</script>

<style>
  .badge {
    position: absolute;
    height: 24px;
    width: 24px;
  }

  .badge-text {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;

    background: var(--background);
    color: var(--color);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

<div bind:this={badgeEl} class="badge">
  <span class="badge-text">
    <slot />
  </span>
</div>
