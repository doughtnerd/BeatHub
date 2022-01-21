<script>
  import { modsStore } from "../../stores/mods.store";
  import ModTable from "./components/ModTable.svelte";
</script>

<div class="main-content">
  <ModTable mods={$modsStore} />
</div>

<style>
  .main-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: 16px;
  }
</style>
