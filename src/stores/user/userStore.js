import router from "../../router";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, getDocs, query, where, collection } from "firebase/firestore";
import { db } from "../../firebase";

const userStore = {
  state: {
    user: null,
    role: null,
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    CLEAR_USER(state) {
      state.user = null;
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
  },
  actions: {
    async login({ commit }, details) {
      const { email, password } = details;

      try {
        // Verifikasi login pada Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        // Jika ada kesalahan pada Auth Firebase
        switch (error.code) {
          case "auth/user-not-found":
            alert("User not found");
            break;
          case "auth/wrong-password":
            alert("Wrong Password");
            break;
          default:
            alert("Something went wrong");
        }
        return;
      }

      // Jika login Auth Firebase berhasil, lanjutkan ke verifikasi Firestore
      commit("SET_USER", auth.currentUser);
      const userUid = auth.currentUser.uid;

      try {
        // Ambil dokumen user berdasarkan UID dari Firestore
        const userDoc = doc(db, "users", userUid);
        const docSnapshot = await getDoc(userDoc);

        if (docSnapshot.exists()) {
          // Jika dokumen user ditemukan, ambil data user
          const userData = docSnapshot.data();
          const userRoleId = userData.role_id;

          // Ambil data role berdasarkan role_id dari Firestore
          const roleRef = doc(db, "role", userRoleId);
          const roleDoc = await getDoc(roleRef);

          if (roleDoc.exists()) {
            // Jika dokumen role ditemukan, ambil tipe role
            const roleData = roleDoc.data();
            const roleType = roleData.type;

            // Debugging: Log tipe role yang diambil dari Firestore
            console.log("Tipe Role pengguna:", roleType);

            // Set role pengguna ke dalam store (Vuex)
            commit("SET_ROLE", roleType);

            // Arahkan pengguna sesuai dengan tipe role
            if (roleType === "user") {
              console.log("Pengguna dengan tipe 'user' dialihkan ke /home");
              router.push("/home");
            } else if (roleType === "admin") {
              console.log("Pengguna dengan tipe 'admin' dialihkan ke /admin");
              router.push("/admin");
            } else {
              console.log("Tipe role tidak valid. Mengarahkan ke halaman /");
              alert("Invalid role type. Contact support.");
              await auth.signOut();
            }
          } else {
            // Jika dokumen role tidak ditemukan di Firestore
            console.error("Role tidak ditemukan di Firestore!");
            alert("User role not found. Contact support.");
            // Logout jika Firestore tidak memiliki data role pengguna
            await auth.signOut();
          }
        } else {
          // Jika dokumen user tidak ditemukan di Firestore
          console.error("No user document found in Firestore!");
          alert("User data not found. Contact support.");
          // Logout jika Firestore tidak memiliki data pengguna
          await auth.signOut();
        }
      } catch (error) {
        console.error("Error verifying user in Firestore:", error);
        alert("Error verifying user.");
        // Logout jika terjadi kesalahan pada Firestore
        await auth.signOut();
      }
    },

    async register({ commit }, details) {
      const { nama, no_tlpn, alamat, email, password } = details;

      try {
        // Membuat user baru dengan email dan password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Mendapatkan role_id dari koleksi "role" yang memiliki tipe "user"
        const roleSnapshot = await getDocs(query(collection(db, "role"), where("type", "==", "user")));
        let roleId = null;

        roleSnapshot.forEach((doc) => {
          roleId = doc.id; // Mengambil ID dari dokumen yang sesuai
        });

        if (!roleId) {
          throw new Error("Role 'user' not found");
        }

        // Menyimpan data pengguna ke dalam koleksi "users"
        await setDoc(doc(db, "users", user.uid), {
          user_uid: user.uid,
          nama: nama,
          no_tlpn: no_tlpn,
          alamat: alamat,
          email: email,
          password: password,
          role_id: roleId, // Menggunakan role_id yang diperoleh
        });

        // Mengubah state user
        commit("SET_USER", user);

        // Mengarahkan ke halaman home
        router.push("/home");
      } catch (error) {
        switch (error.code) {
          case "auth/email-already-in-use":
            alert("Email already in use");
            break;
          case "auth/invalid-email":
            alert("Invalid email");
            break;
          case "auth/operation-not-allowed":
            alert("Operation not allowed");
            break;
          case "auth/weak-password":
            alert("Weak password");
            break;
          default:
            alert(error.message || "Something went wrong");
        }
        return;
      }
    },

    async logout({ commit }) {
      await signOut(auth);
      commit("CLEAR_USER");
      router.push("/");
    },

    fetchUser({ commit }) {
      auth.onAuthStateChanged(async (user) => {
        if (user === null) {
          commit("CLEAR_USER");
        } else {
          commit("SET_USER", user);

          if (router.isReady() && router.currentRoute.value.path === "/") {
            router.push("/home");
          }
        }
      });
    },
  },
};

export default userStore;
