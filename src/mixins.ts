import { watch } from "vue";
import { useRoute } from "vue-router";

const refreshOnRouteChange = (
  initialize: (id: string, userID?: string) => void
) => {
  const route = useRoute();

  watch(route, async (_, newRoute) => {
    const id = newRoute.params.id as string;
    const userID = newRoute.params.userID as string;
    if (id && userID) initialize(id, userID);
    else if (id) initialize(id);
  });
};

export { refreshOnRouteChange };
