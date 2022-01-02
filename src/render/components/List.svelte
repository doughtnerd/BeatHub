<style>
  .list {
    display: flex;
    flex-direction: column;
  }

  .list > :global(*:not(:last-child)) {
    margin-bottom: 8px;
  }
</style>

<div role="list" class="list">
  <slot />
</div>