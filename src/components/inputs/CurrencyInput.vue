<template>
  <input
    ref="inputRef"
    type="text"
    :value="formattedValue"
    placeholder="Cost"
    style="margin-right: 10px; width: 80px;"
  />
</template>

<script lang="ts">
import { useCurrencyInput } from "vue-currency-input";

export default {
  name: "Currency Input",
  props: {
    modelValue: Number,
    options: Object,
  },
  setup(props: any) {
    const { formattedValue, inputRef } = useCurrencyInput(props.options);
    return { inputRef, formattedValue };
  },
};
</script>

<style></style>
