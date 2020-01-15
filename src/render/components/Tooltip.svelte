<style>
  .tooltip {
  }

  .tooltip .tooltiptext {
    position: absolute;
    display: inline-block;
    width: 120px;
    background-color: var(--primary);
    color: var(--foregroundText);
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    text-shadow: 0 0 2px black;

    position: absolute;
  }

  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent var(--primary) transparent transparent;
  }

  .tooltip:hover .tooltiptext {
    display: block;
    visibility: visible;
  }
</style>

<div class="tooltip">
  <slot />
  <span class="tooltiptext">
    <slot name="tooltipText" />
  </span>
</div>
