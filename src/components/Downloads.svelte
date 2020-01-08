<script>
  import Icon from "svelte-awesome";
  import { download } from "svelte-awesome/icons";
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
  <span style="color: blue">
    <Icon scale={0.8} data={download} />
  </span>
</div>
