import { createStore } from "vuex";
import orderStore from "../stores/order/orderStore";
import userStore from "../stores/user/userStore";
import progresStore from "../stores/progres/progresStore";

const store = createStore({
  modules: {
    order: orderStore,
    user: userStore,
    progres: progresStore,
  },
});

export default store;
