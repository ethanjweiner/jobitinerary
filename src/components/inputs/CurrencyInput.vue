<template>
  <input
    class="currency-input"
    ref="inputRef"
    type="text"
    :value="formattedValue"
    :placeholder="placeholder"
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

<style scoped>
input {
  background: white;
  border: 1px solid var(--ion-color-primary);
  color: var(--ion-color-primary);
  border-radius: 10px;
  text-align: center;
  max-width: 125px;
}
input:disabled {
  background: rgb(240, 240, 240);
  color: grey;
  border: 1px solid grey;
}
</style>
