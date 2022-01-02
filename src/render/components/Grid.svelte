<script>
  export let columns = '1fr';
  export let rows = '1fr';

  export let style = ''
</script>


<div style={`display: grid; grid-template-columns:${columns}; grid-template-rows: ${rows}; ${style}`}>
  <slot />
</div>