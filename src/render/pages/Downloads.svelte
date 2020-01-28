<script>
  import QueuedDownloadsList from "../components/QueuedDownloadsList.svelte";
  import CompletedDownloadsList from "../components/CompletedDownloadsList.svelte";
</script>

<style>
  .downloads-container {
    padding-left: 16px;
    padding-right: 16px;
    overflow-y: scroll;
  }

  .downloads-container::-webkit-scrollbar {
    background-color: var(--foreground);
  }

  .downloads-container::-webkit-scrollbar-thumb:window-inactive,
  ::-webkit-scrollbar-thumb {
    background-image: linear-gradient(
      to bottom,
      var(--scrollbarPrimaryColor),
      var(--scrollbarSecondaryColor)
    );
    border: 2px solid var(--background);
  }
</style>

<div class="downloads-container">

  <QueuedDownloadsList />

  <CompletedDownloadsList />

</div>
