<script>
  import Icon from "svelte-awesome";

  export let scale = 5;
  export let color;
  export let hoverColor = "#30588e";
  export let iconColor;
  export let iconData;
  export let iconScale;
</script>

<style>
  .round-button-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;

    background: var(--color);
    color: var(--iconColor);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .round-button-circle:hover {
    background: var(--hoverColor);
  }

  .round-button:hover {
    cursor: pointer;
  }
</style>

<div
  class="round-button"
  style="--hoverColor:{hoverColor}; height:{scale * 8}px; width:{scale * 8}px"
  on:click>
  <div
    class="round-button-circle"
    style="--color:{color}; --iconColor:{iconColor}">
    <div>
      <Icon scale={iconScale} data={iconData} />
    </div>
  </div>
</div>
