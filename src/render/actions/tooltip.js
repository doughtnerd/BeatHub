import { listen } from "svelte/internal";

export function tooltip(node, tooltipText) {
  const tooltip = document.createElement("div");
  const style = document.createElement("style");
  tooltip.textContent = tooltipText;
  tooltip.className = "tooltip";

  style.textContent = `
    .tooltip {
      position: absolute;
      color: var(--foregroundText);
      background-color: var(--background);
      border-radius: 8px;
      padding: 8px;
      width: 120px;
      text-align: center;
      transition: opacity .5s;
      transform: translate(5px, -50%);
      text-shadow: 0 0 2px var(--background);
    }

    .tooltip::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 100%;
      margin-top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent var(--background) transparent transparent;
    }
  `;

  function position() {
    const { top, right, bottom } = node.getBoundingClientRect();
    tooltip.style.top = `${(top + bottom) / 2}px`;
    tooltip.style.left = `${right}px`;
  }

  function append() {
    document.body.appendChild(tooltip);
    tooltip.prepend(style);
    tooltip.style.opacity = "0";
    setTimeout(() => (tooltip.style.opacity = "1"));
    position();
  }

  function remove() {
    tooltip.remove();
  }

  const cancelMouseenter = listen(node, "mouseenter", append);
  const cancelMouseleave = listen(node, "mouseleave", remove);

  return {
    destroy() {
      remove();
      cancelMouseenter();
      cancelMouseleave();
    },

    update(newText) {
      tooltip.textContent = newText;
    }
  };
}
