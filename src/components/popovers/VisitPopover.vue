<template>
  <ion-list>
    <ion-item button>
      <ion-text color="danger">
        <ion-icon :icon="trash" color="danger"></ion-icon>

        Delete Visit
      </ion-text>
    </ion-item>
  </ion-list>
</template>

<script>
import { trash } from "ionicons/icons";
export default {
  name: "Visit Popover",
  components: {},
  setup() {
    return { trash };
  },
};
</script>

<style>
ion-list {
  padding: 0 !important;
}
</style>
