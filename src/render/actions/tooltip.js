import { listen } from "svelte/internal";

export function tooltip(node, { text, position = "right" }) {
  const tooltip = document.createElement("div");
  const style = document.createElement("style");
  tooltip.textContent = text;
  tooltip.className = "tooltip";

  const tooltipStyle = `
    .tooltip {
      position: absolute;
      color: var(--backgroundText);
      background-color: var(--tooltipBackgroundColor);
      border-radius: 8px;
      padding: 8px;
      width: 120px;
      text-align: center;
      transition: opacity .5s;
      transform: translate(5px, -50%);
    }
  `;

  const leftPointerStyle = `
      .tooltip::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 100%;
        margin-top: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent transparent var(--tooltipBackgroundColor) ;
      }
  `;

  const rightPointerStyle = `
    .tooltip::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 100%;
      margin-top: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: transparent var(--tooltipBackgroundColor) transparent transparent;
    }
  `;

  switch (position) {
    case "right": {
      style.textContent = tooltipStyle + rightPointerStyle;
      break;
    }
    case "left": {
      style.textContent = tooltipStyle + leftPointerStyle;
      break;
    }
  }

  function positionTooltip() {
    const { top, right, bottom, left, width } = node.getBoundingClientRect();
    tooltip.style.top = `${(top + bottom) / 2}px`;
    switch (position) {
      case "right": {
        tooltip.style.left = `${right}px`;
        break;
      }
      case "left": {
        tooltip.style.left = `${left - width}px`; // = `${left}px`;
        break;
      }
    }
  }

  function append() {
    document.body.appendChild(tooltip);
    tooltip.prepend(style);
    tooltip.style.opacity = "0";
    setTimeout(() => (tooltip.style.opacity = "1"));
    positionTooltip();
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

    update({ text, position }) {
      tooltip.textContent = text;
    },
  };
}
