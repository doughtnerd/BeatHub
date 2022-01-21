<script>
  import compareVersions from "compare-versions";
  import { createEventDispatcher } from "svelte";

  export let mod;

  const dispatch = createEventDispatcher();

  function handleClickInstallMod(mod) {
    dispatch("installMod", mod);
  }

  function handleClickUninstallMod(mod) {
    dispatch("uninstallMod", mod);
  }
</script>

<tr>
  <td>
    {mod.name}
  </td>
  <td class="mod-version-data">
    {#if mod.installed && compareVersions(mod.installedVersion, mod.version) === -1}
      <strike>{mod.installedVersion}</strike>{mod.version}
    {:else}
      <span>{mod.version}</span>
    {/if}
  </td>
  <td>
    {#if mod.installed}
      {#if compareVersions(mod.installedVersion, mod.version) === -1}
        <button on:click={() => handleClickInstallMod(mod)}>Update</button>
      {:else}
        <button on:click={() => handleClickUninstallMod(mod)} class="btn btn-primary">Uninstall</button>
      {/if}
    {:else}
      <button on:click={() => handleClickInstallMod(mod)} class="btn btn-primary">Install</button>
    {/if}
  </td>
</tr>

<style>
  .mod-version-data > :first-child {
    margin-right: 8px;
  }

  .mod-version-data > strike {
    color: red;
  }
</style>
