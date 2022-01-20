<script>
  import { modsStore } from "../../stores/mods.store";
  import compareVersions from "compare-versions";
  // import * as semver from "semver";
</script>

<div class="main-content">
  <table>
    <thead style="text-align:left">
      <tr>
        <th>Name</th>
        <th>Version</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each $modsStore as mod}
        <tr>
          <td>{mod.name}</td>
          <td>
            {#if mod.installed && compareVersions(mod.installedVersion, mod.version) === -1}
              <strike>{mod.installedVersion}</strike>{mod.version}
            {:else}
              {mod.version}
            {/if}
          </td>
          <td>{mod.version}</td>
          <td>
            {#if mod.installed}
              <button on:click={() => modsStore.uninstallMod(mod)} class="btn btn-primary">Uninstall</button>
            {:else}
              <button on:click={() => modsStore.installMod({ ...mod, _id: mod.installedId })} class="btn btn-primary">Install</button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
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
