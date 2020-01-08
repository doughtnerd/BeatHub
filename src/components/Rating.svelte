<script>
  import Icon from "svelte-awesome";
  import { percent } from "svelte-awesome/icons";

  export let percentage;

  $: textVal = Math.round(percentage * 100);
</script>

<style>
  div {
    font-size: 0.8em;
  }
</style>

<div>
  <span>{textVal}</span>
  <span style="color: orange">
    <Icon scale={0.8} data={percent} />
  </span>
</div>
