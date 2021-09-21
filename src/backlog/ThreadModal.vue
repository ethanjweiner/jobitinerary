<template>
  Thread Modal
</template>

<script lang="ts">
import { reactive } from "@vue/reactivity";
import { sampleThread } from "@/types";
export default {
  name: "Thread Modal",
  props: {
    threadID: Number,
  },
  setup(props: any) {
    // console.log(props.threadID);
    // // Retrieve the thread upon load
    // const state = reactive({
    //     thread: sampleThread
    // })
  },
};
</script>

<style></style>
