<script>
  import { tooltip } from "../actions/tooltip";

  export let characteristic;
  export let difficulty;

  const bgColorMap = {
    Easy: "--easyChipBackgroundColor",
    Normal: "--normalChipBackgroundColor",
    Hard: "--hardChipBackgroundColor",
    Expert: "--expertChipBackgroundColor",
    ExpertPlus: "--expertPlusChipBackgroundColor",
  };

  const iconMap = {
    Standard: "icons/standard.svg",
    OneSaber: "icons/onesaber.svg",
    NoArrows: "icons/noarrows.svg",
    "90Degree": "icons/90degree.svg",
    "360Degree": "icons/360degree.svg",
    Lightshow: "icons/lightshow.svg",
    Lawless: "icons/lawless.svg",
  };
  
  let chipContainer;

  $: bgColor = bgColorMap[difficulty];
  $: icon = iconMap[characteristic];

  $: {
    if(chipContainer) {
      chipContainer.style.setProperty('--chipBackgroundColor', `var(${bgColor})`);
    } 
  }
</script>

<span bind:this={chipContainer} use:tooltip={{ text: `${difficulty} ${characteristic}` }} class="chip">
  <img src={icon} width="24px" alt="Song Characteristic: {difficulty} {characteristic}" />
</span>

<style>
  .chip {
    color: white;
    background-color: var(--chipBackgroundColor);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px 8px 2px 8px;
  }
</style>
