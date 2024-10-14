import router from "../../router";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Firestore database

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
          const userRole = userData.role;

          // Debugging: Log role yang diambil dari Firestore
          console.log("Role pengguna:", userRole);

          // Set role pengguna ke dalam store (Vuex)
          commit("SET_ROLE", userRole);

          // Arahkan pengguna sesuai dengan perannya
          if (userRole === "user") {
            console.log("Pengguna dengan role 'user' dialihkan ke /home");
            router.push("/home");
          } else if (userRole === "admin") {
            console.log("Pengguna dengan role 'admin' dialihkan ke /admin");
            router.push("/admin");
          } else {
            console.log("Role tidak valid. Mengarahkan ke halaman /");
            alert("Invalid role. Contact support.");
            await auth.signOut();
          }
        } else {
          // Jika dokumen user tidak ditemukan di Firestore
          console.error("No user document found in Firestore!");
          alert("User data not found . Contact support.");
          // Logout jika Firestore tidak memiliki data pengguna
          await auth.signOut();
        }
      } catch (error) {
        console.error("Error verifying user in Firestore:", error);
        alert("Error verifying user .");
        // Logout jika terjadi kesalahan pada Firestore
        await auth.signOut();
      }
    },

    async register({ commit }, details) {
      const { nama, no_tlpn, alamat, email, password } = details;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          user_uid: user.uid,
          nama: nama,
          no_tlpn: no_tlpn,
          alamat: alamat,
          email: email,
          password: password,
          role: "user",
        });

        commit("SET_USER", user);

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
            alert("Something went wrong");
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
