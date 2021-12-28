<script>

</script>

<style>
  .list {
    display: flex;
    flex-direction: column;
    padding: 8px;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
  }

  .list > :global(*:not(:last-child)) {
    margin-bottom: 8px;
  }

  .list::-webkit-scrollbar {
    background-color: var(--foreground);
  }

  .list::-webkit-scrollbar-thumb:window-inactive,
  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(to bottom, var(--scrollbarPrimaryColor), var(--scrollbarSecondaryColor));
    border: 2px solid var(--background);
  }
</style>

<div class="list">
  <slot />
</div>