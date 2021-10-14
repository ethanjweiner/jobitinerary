<template>
  <ion-content>
    <ion-list>
      <div v-if="state.lists.length > 1">
        <!-- Create an item group for each list -->
        <ion-item-group v-for="list in state.lists" :key="list.name">
          <div v-if="list.items.length">
            <ion-item-divider>
              <ion-label>
                {{ list.name }}
              </ion-label>
            </ion-item-divider>
            <slot
              name="item"
              v-for="(item, index) in list.items"
              :key="index"
              :item="item"
            ></slot>
          </div>
        </ion-item-group>
      </div>
      <div v-else>
        <!-- Regular list type -->
        <!-- Use "slot props" so that the data from the infinite list is rendered into the item -->
        <slot
          name="item"
          v-for="(item, index) in state.items"
          :key="index"
          :item="item"
        ></slot>
      </div>
    </ion-list>

    <ion-infinite-scroll
      @ionInfinite="loadMore($event)"
      threshold="100px"
      id="infinite-scroll"
    >
      <ion-infinite-scroll-content
        loading-spinner="bubbles"
        loading-text="Loading visits..."
      >
      </ion-infinite-scroll-content>
    </ion-infinite-scroll>
  </ion-content>
</template>

<script lang="ts">
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonList,
  IonItemGroup,
  IonItemDivider,
  IonLabel,
} from "@ionic/vue";
import { reactive } from "@vue/reactivity";
import { CollectionRef, DocSnapshot, Splitter } from "@/types/auxiliary";
import { search } from "@/db";

interface State {
  items: Array<any>;
  lists: Array<{ name: string; items: Array<any> }>;
  endDoc: DocSnapshot | null;
}

// NOTE: THIS COMPONENT RERENDERS AND RELOADS DATA UPON ANY SEARCH CHANGE
export default {
  name: "Infinite List",
  props: {
    splitters: Array,
    pushQuantity: Number,
    dbRef: {
      type: Object as () => CollectionRef,
    },
    orderByParam: String,
    searchFilter: String,
  },
  setup(props: any) {
    const state = reactive<State>({
      items: [],
      lists: [],
      endDoc: null,
    });

    // Q: Why query the database directly inside the infinite list component?
    // A: The process of loading more data in the infinite list component is streamlined: Directly query db, instead of emitting

    // pushItems : Retrieves more items and pushes to the parent list _items_
    // A return value of 0 represents success
    // A return value of 1 indicates that query limit has been reached
    const pushItems = async (): Promise<Array<object>> => {
      // QUERY DATABASE WITH FILTERS AS NECESSARY, UNTIL _props.pushQuantity RESULTS ARE RETRIEVED
      const docsToPush = await search(
        props.dbRef,
        props.pushQuantity,
        props.orderByParam,
        props.searchFilter,
        state.endDoc
      );

      const items = docsToPush.map((doc: DocSnapshot) => {
        const docData = doc.data();
        if (docData) return docData.data;
        else return null;
      });
      if (docsToPush.length) state.endDoc = docsToPush[docsToPush.length - 1];
      return items;
    };

    const refreshLists = () => {
      state.lists = [];
      // Split items into multiple lists
      if (props.splitters) {
        props.splitters.forEach((splitter: Splitter) => {
          const list = {
            name: splitter.name,
            items: state.items.filter(splitter.filter),
          };
          state.lists.push(list);
        });
      }
    };

    if (props.dbRef) {
      // Add items on load
      pushItems()
        .then((items) => (state.items = state.items.concat(items)))
        .then(refreshLists);
    }

    // Load more items on scroll
    const loadMore = async (ev: any) => {
      const items = await pushItems();
      refreshLists();
      // Query limit reached
      if (!items.length) ev.target.complete();
      else ev.target.disabled = true;
    };

    return {
      state,
      loadMore,
    };
  },
  components: {
    IonContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonItemGroup,
    IonItemDivider,
    IonLabel,
  },
};
</script>

<style></style>
