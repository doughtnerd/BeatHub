import { listen } from "svelte/internal";

export function tooltip(node, { text, position = "right" }) {
  if (!text) return;
  const tooltip = document.createElement("div");
  const linkEl = document.createElement('link');
  linkEl.type = 'text/css';
  linkEl.rel = 'stylesheet';
  linkEl.href = './tooltip.css';
  tooltip.textContent = text;
  tooltip.className = "tooltip";

  tooltip.classList.add(`${position}`);

  function positionTooltip() {
    const { top, right, bottom, left, width } = node.getBoundingClientRect();
    tooltip.style.top = `${(top + bottom) / 2}px`;
    switch (position) {
      case "right": {
        tooltip.style.left = `${right}px`;
        break;
      }
      case "left": {
        tooltip.style.left = `${left - 8}px`;
        break;
      }
    }
  }

  function append() {
    document.body.appendChild(tooltip);
    tooltip.prepend(linkEl);
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
