<script>
  import Icon from "svelte-awesome";

  export let icon;
  export let size = 1;
  export let iconColor;
  export let fontColor = "var(--backgroundText)";

  let statContainer;
  let statIconContainer;

  $: {
    if(statContainer) {
      statContainer.style.fontSize = `${size}rem`;
      statContainer.style.color = fontColor;
    }
  }

  $: {
    if(statIconContainer) {
      statIconContainer.style.color = iconColor;
    }
  }

</script>

<div bind:this={statContainer}>
  <span>
    <slot />
  </span>
  <span bind:this={statIconContainer}>
    <Icon scale={size} data={icon} />
  </span>
</div>
