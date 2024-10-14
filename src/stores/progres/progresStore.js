import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const store = {
  state: {},
  mutations: {},
  actions: {
    async updateProgres({ commit }, { orderId, progress }) {
      try {
        const progresRef = doc(db, "orders", orderId, "progres", "tracking");
        await setDoc(progresRef, progress, { merge: true });
        console.log("Progress updated successfully");
      } catch (error) {
        console.error("Error updating progress: ", error);
      }
    },
  },
};

export default store;
