<script>
  export let mode = "slim";
  export let isOpen = true;

  $: isSlim = mode === "slim";
  $: isFull = mode === "full";
  $: isClosed = !isOpen;
</script>

<style>
  .drawer {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.5);
  }

  .drawer--slim {
    width: 72px;
    max-width: 72px;
  }

  .drawer--full {
    width: 216px;
    max-width: 216px;
  }

  .drawer--closed {
    width: 0px;
    max-width: 0px;
    display: none;
  }

  .main {
    padding: 8px;
    height: 100%;
  }

  .main--slim {
    margin-left: 72px;
  }

  .main--full {
    margin-left: 216px;
  }

  .main--closed {
    margin-left: 0px;
  }
</style>

<div
  class="drawer"
  class:drawer--slim={isSlim}
  class:drawer--full={isFull}
  class:drawer--closed={isClosed}>
  <slot name="drawer-content" />
</div>
<div
  class="main"
  class:main--slim={isSlim}
  class:main--full={isFull}
  class:main--closed={isClosed}>
  <slot />
</div>
