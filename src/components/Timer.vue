<template>
  <div style="width: 100%;" class="ion-text-center">
    <h1>
      {{
        timerValue
          ? `${timerValue.days ? timerValue.days + ":" : ""}${(
              "0" + timerValue.hours
            ).slice(-2)}:${("0" + timerValue.minutes).slice(-2)}:${(
              "0" + timerValue.seconds
            ).slice(-2)}`
          : ""
      }}
    </h1>
  </div>
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";

export default {
  name: "Timer",
  props: {
    startTime: String,
  },
  setup(props: any) {
    const startTime = new Date(props.startTime);
    const timerValue = reactive<any>({});

    const refreshTimer = () => {
      const t = Date.now() - startTime.getTime();
      timerValue.seconds = Math.floor((t / 1000) % 60);
      timerValue.minutes = Math.floor((t / 1000 / 60) % 60);
      timerValue.hours = Math.floor((t / (1000 * 60 * 60)) % 24);
      timerValue.days = Math.floor(t / (1000 * 60 * 60 * 24));
    };
    refreshTimer();

    setInterval(refreshTimer, 1000);

    return { timerValue };
  },
  components: {},
};
</script>

<style></style>
