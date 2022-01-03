<script>
  export let columns = '1fr';
  export let rows = '1fr';

  export let style = ''

  let gridEl;

  $: { 
    if(gridEl) {
      gridEl.style.cssText = `
        display: grid;
        grid-template-columns: ${columns};
        grid-template-rows: ${rows};
        ${style}`
    }
  }
</script>

<div bind:this={gridEl}>
  <slot />
</div>