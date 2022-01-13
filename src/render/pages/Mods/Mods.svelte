<script>

  import LoadingScreen from '../../components/LoadingScreen.svelte'
  import {getMods} from '../../services/beatmod-api'

  function handleModClick(mod) {
    window.api.invoke('installMod', {mod}).catch(err => {
      console.log(err)
    })
  }
  
</script>

<div class="main-content">
  {#await getMods()}
    <LoadingScreen />
  {:then mods}
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
          <tr>
            <td>{mod.name}</td>
            <td>{mod.version}</td>
            <td>
              <button on:click={() => handleModClick(mod)} class="btn btn-primary">Install</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
   
  {/await}
</div>

<style>
  .main-content {
    display: flex; 
    flex-direction: column; 
    height: 100%; 
    overflow-y:auto; 
    padding:16px;
  }
</style>