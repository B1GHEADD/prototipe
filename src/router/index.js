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
        roleType: "user",
      },
    },
    {
      path: "/profiel",
      name: "profiel",
      component: ProfielView,
      meta: {
        requiresAuth: true,
        roleType: "user",
      },
    },
    {
      path: "/resi",
      name: "resi",
      component: ResiView,
      meta: {
        requiresAuth: true,
        roleType: "user",
      },
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      meta: {
        requiresAuth: true,
        roleType: "admin",
      },
    },
    {
      path: "/user-admin",
      name: "UserView",
      component: UserAdmin,
      meta: {
        requiresAuth: true,
        roleType: "admin",
      },
    },
    {
      path: "/produk",
      name: "ProdukView",
      component: ProdukView,
      meta: {
        requiresAuth: true,
        roleType: "admin",
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
      // Jika halaman membutuhkan autentikasi dan user belum login
      if (to.name !== "login") {
        next({ name: "login" });
      } else {
        next();
      }
    } else if (requiresAuth && user) {
      // Jika halaman membutuhkan autentikasi dan user sudah login
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRoleId = userData.role_id;

        // Ambil data role berdasarkan role_id dari Firestore
        const roleRef = doc(db, "role", userRoleId);
        const roleDoc = await getDoc(roleRef);

        if (roleDoc.exists()) {
          const roleData = roleDoc.data();
          const roleType = roleData.type;

          // Cek akses halaman berdasarkan roleType dan meta roleType
          const routeRoleType = to.meta.roleType;
          if (routeRoleType && routeRoleType !== roleType) {
            // Jika roleType tidak sesuai dengan akses halaman
            if (roleType === "user") {
              next({ name: "home" });
            } else if (roleType === "admin") {
              next({ name: "admin" });
            } else {
              next({ name: "login" });
            }
          } else {
            // Jika roleType sesuai dengan akses halaman
            next();
          }
        } else {
          // Redirect ke login jika role_id tidak ditemukan
          if (to.name !== "login") {
            next({ name: "login" });
          } else {
            next();
          }
        }
      } else {
        // Redirect ke login jika data user tidak ditemukan
        if (to.name !== "login") {
          next({ name: "login" });
        } else {
          next();
        }
      }
    } else {
      // Jika halaman tidak membutuhkan autentikasi
      next();
    }
  });
});

export default router;
