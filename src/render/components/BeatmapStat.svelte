<script>
  import Icon from "svelte-awesome";

  export let icon;
  export let size = 1;
  export let iconColor;
  export let fontColor = "var(--backgroundText)";
</script>

<div style="font-size: {size}rem; color: {fontColor}">
  <span>
    <slot />
  </span>
  <span style="color: {iconColor}">
    <Icon scale={size} data={icon} />
  </span>
</div>
