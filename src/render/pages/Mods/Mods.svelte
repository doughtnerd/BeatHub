<script>

  import {getMods} from '../../services/beatmod-api'

  function handleModClick(mod) {
    window.api.invoke('installMod', {mod}).catch(err => {
      console.log(err)
    })
  }
  
</script>

{#await getMods()}
{:then mods}
  {#each mods as mod}
    <button type="button" on:click={() => handleModClick(mod)}>
      {mod.name}
    </button>
  {/each}
{/await}