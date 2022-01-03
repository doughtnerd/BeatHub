<script>
  export let color = "var(--primary)";
  export let scale = 1;

  let spinnerContainer;

  // $: scaleToPx = 8 * scale + "px";

  $: {
    if(spinnerContainer) {
      const scaleToPx = 8 * scale + "px";
      spinnerContainer.style.setProperty("--spinnerColor", color);
      spinnerContainer.style.setProperty("--scale", scaleToPx);
    }
  }

</script>

<style>
  .spinner {
    width: 100%;
    text-align: center;
  }

  .spinner > div {
    width: var(--scale);
    height: var(--scale);
    background-color: var(--spinnerColor);

    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }

  .spinner .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  .spinner .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }

  @-webkit-keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
    }
  }

  @keyframes sk-bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      transform: scale(0);
    }
    40% {
      -webkit-transform: scale(1);
      transform: scale(1);
    }
  }
</style>

<div bind:this={spinnerContainer} class="spinner">
  <div class="bounce1" />
  <div class="bounce2" />
  <div class="bounce3" />
</div>
