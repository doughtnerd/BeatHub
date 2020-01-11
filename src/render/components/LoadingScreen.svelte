<script>
  import LoadingSpinner from "./LoadingSpinner.svelte";
</script>

<style>
  .loading-screen {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>

<div class="loading-screen">
  <LoadingSpinner scale={2} />
</div>
