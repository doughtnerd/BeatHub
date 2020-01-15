<script>
  export let mode = "slim";
  export let isOpen = true;

  $: isSlim = mode === "slim";
  $: isFull = mode === "full";
  $: isClosed = !isOpen;
</script>

<style>
  .drawer-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
  }

  .drawer {
    flex-shrink: 0;
    flex-grow: 0;
    height: 100%;
    background-color: var(--background);
    color: var(--backgroundText);
    overflow-y: scroll;
    /* overflow-x: hidden; */
  }

  .drawer::-webkit-scrollbar {
    display: none;
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
    background-color: var(--foreground);
    flex-grow: 1;

    display: flex;
    flex-direction: column;
  }

  .main::-webkit-scrollbar {
    display: none;
  }
</style>

<div class="drawer-container">
  <div
    class="drawer"
    class:drawer--slim={isSlim}
    class:drawer--full={isFull}
    class:drawer--closed={isClosed}>
    <slot name="drawer-content" />
  </div>
  <div class="main">
    <slot />
  </div>
</div>
