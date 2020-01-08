<script>
  import Icon from "svelte-awesome";
  import { thumbsUp } from "svelte-awesome/icons";

  export let count;

  $: textVal = count.toLocaleString();
</script>

<style>
  div {
    font-size: 0.8em;
  }
</style>

<div>
  <span>{textVal}</span>
  <span style="color: green">
    <Icon scale={0.8} data={thumbsUp} />
  </span>
</div>
