<style>
  .beatmap-list {
    display: flex;
    flex-direction: column;
    padding: 8px;
    overflow-y: scroll;
    height: 100%;
  }

  .beatmap-list::-webkit-scrollbar {
    background-color: var(--foreground);
  }

  .beatmap-list::-webkit-scrollbar-thumb:window-inactive,
  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(
      to bottom,
      var(--scrollbarPrimaryColor),
      var(--scrollbarSecondaryColor)
    );
    border: 2px solid var(--background);
  }
</style>

<div class="beatmap-list">
  <slot />
</div>
