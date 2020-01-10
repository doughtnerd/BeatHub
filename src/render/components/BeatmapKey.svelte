<script>
  import Icon from "svelte-awesome";
  import { key } from "svelte-awesome/icons";
</script>

<style>
  div {
    font-size: 0.8em;
  }
</style>

<div>
  <span>
    <slot />
  </span>
  <span style="color: gold;">
    <Icon scale={0.8} data={key} />
  </span>
</div>
