import { createRouter, createWebHistory } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import LoginView from "../views/LoginView.vue";
import RegisView from "../views/RegisView.vue";
import HomeView from "../views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import ResiView from "@/views/ResiView.vue";
import UserAdmin from "@/views/UserAdmin.vue";
import ProdukView from "@/views/ProdukView.vue";
import ProfielView from "@/views/ProfielView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginView,
    },
    {
      path: "/register",
      name: "register",
      component: RegisView,
    },
    {
      path: "/home",
      name: "home",
      component: HomeView,
      meta: {
        requiresAuth: true,
        role: "user", // Akses untuk user biasa
      },
    },
    {
      path: "/profiel",
      name: "profiel",
      component: ProfielView,
      meta: {
        requiresAuth: true,
        role: "user", // Akses untuk user biasa
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {
        requiresAuth: true,
        role: "admin", // Akses untuk admin
      },
    },
    {
      path: "/resi",
      name: "resi",
      component: ResiView,
    },
    {
      path: "/user-admin",
      name: "UserView",
      component: UserAdmin,
      meta: {
        requiresAuth: true,
        role: "admin",
      },
    },
    {
      path: "/produk",
      name: "ProdukView",
      component: ProdukView,
      meta: {
        requiresAuth: true,
        role: "admin",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = getAuth();
  const db = getFirestore();

  onAuthStateChanged(auth, async (user) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

    if (requiresAuth && !user) {
      next({ name: "login" });
    } else if (requiresAuth && user) {
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;

        if (to.meta.role && to.meta.role === userRole) {
          next();
        } else {
          next({ name: "home" });
        }
      }
    } else {
      next();
    }
  });
});

export default router;
