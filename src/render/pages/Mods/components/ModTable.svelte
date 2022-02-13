<script>
  import ModTableRow from "./ModTableRow.svelte";

  export let mods;
</script>

<table>
  <thead style="text-align:left">
    <tr>
      <th>Name</th>
      <th>Version</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each mods as mod}
      <ModTableRow on:installMod on:uninstallMod {mod} />
    {/each}
  </tbody>
</table>
