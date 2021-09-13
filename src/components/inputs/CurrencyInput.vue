<template>
  <input
    class="currency-input"
    ref="inputRef"
    type="text"
    :value="formattedValue"
    :placeholder="placeholder"
    style="margin-right: 10px;"
  />
</template>

<script lang="ts">
import { useCurrencyInput } from "vue-currency-input";

export default {
  name: "Currency Input",
  props: {
    modelValue: Number,
    options: Object,
    placeholder: String,
  },
  setup(props: any) {
    const { formattedValue, inputRef } = useCurrencyInput(props.options);
    return { inputRef, formattedValue };
  },
};
</script>

<style></style>
