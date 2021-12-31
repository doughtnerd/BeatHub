<script>
  export let columns = '1fr';
  export let rows = '1fr';
</script>


<div style={`display: grid; grid-template-columns:${columns}; grid-template-rows: ${rows}`}>
  <slot />
</div>