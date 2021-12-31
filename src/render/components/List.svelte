<script>

</script>

<style>
  .list {
    display: flex;
    flex-direction: column;
  }

  .list > :global(*:not(:last-child)) {
    margin-bottom: 8px;
  }
</style>

<div class="list">
  <slot />
</div>