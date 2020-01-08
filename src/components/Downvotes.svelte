<script>
  import Icon from "svelte-awesome";
  import { thumbsDown } from "svelte-awesome/icons";

  export let count;

  $: textVal = count;
</script>

<style>
  div {
    font-size: 0.8em;
  }
</style>

<div>
  <span>{textVal}</span>
  <span style="color: red">
    <Icon scale={0.8} data={thumbsDown} />
  </span>
</div>
