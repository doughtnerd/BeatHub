<script>
  import { networkIsOnline } from "../stores/network.store";

  import OfflineIcon from "./OfflineIcon.svelte";


</script>

{#if $networkIsOnline === false}
  <div class="banner">
    <OfflineIcon style="margin-right:8px;" />
    <span>App is Offline</span>
  </div>
{/if}

<style>
  .banner {
    padding: 8px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: var(--primary);
  }
</style>