<style>
  :global(::-webkit-scrollbar) {
    background-color: var(--foreground);
  }

  :global(::-webkit-scrollbar-thumb:window-inactive,
  ::-webkit-scrollbar-thumb) {
    background-image: linear-gradient(to bottom, var(--scrollbarPrimaryColor), var(--scrollbarSecondaryColor));
    border: 2px solid var(--background);
  }
</style>