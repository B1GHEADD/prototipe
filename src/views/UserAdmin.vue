<template>
  <NavbarViewAdmin />
  <div class="border border-black w-full h-full p-4">
    <h1 class="text-2xl font-bold mb-4 text-center">Daftar User</h1>
    <button @click="openCreatePopup" class="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600">Tambah User</button>
    <div class="overflow-x-auto">
      <table class="min-w-full border-collapse block md:table bg-white shadow-md rounded-lg">
        <thead class="block md:table-header-group bg-gray-200">
          <tr class="border border-gray-300 md:border-none block md:table-row">
            <th class="block md:table-cell text-center py-2 px-4">Nama</th>
            <th class="block md:table-cell text-center py-2 px-4">Alamat</th>
            <th class="block md:table-cell text-center py-2 px-4">No Tlpn</th>
            <th class="block md:table-cell text-center py-2 px-4">Email</th>
            <th class="block md:table-cell text-center py-2 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody class="block md:table-row-group text-center items-center">
          <tr v-for="user in users" :key="user.id" class="border border-gray-300 md:border-none block md:table-row hover:bg-gray-100">
            <td class="block md:table-cell text-center py-2 px-4">{{ user.nama }}</td>
            <td class="block md:table-cell text-center py-2 px-4">{{ user.alamat }}</td>
            <td class="block md:table-cell text-center py-2 px-4">{{ user.no_tlpn }}</td>
            <td class="block md:table-cell text-center py-2 px-4">{{ user.email }}</td>
            <td class="block md:table-cell text-center py-2 px-4">
              <button @click="openEditPopup(user)" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600">Edit Profil</button>
              <button @click="openPasswordPopup(user)" class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 ml-2">Edit Password</button>
              <button @click="deleteUser(user.id)" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pop-up Form -->
    <div v-if="showPopup" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-8 rounded shadow-md w-1/3">
        <h2 class="text-xl font-bold mb-4 text-center">{{ isEditMode ? "Edit User" : "Tambah User Baru" }}</h2>
        <div class="mb-4">
          <label class="block">Nama:</label>
          <input v-model="newUser.nama" class="w-full border px-2 py-1 rounded" />
        </div>
        <div class="mb-4">
          <label class="block">Alamat:</label>
          <input v-model="newUser.alamat" class="w-full border px-2 py-1 rounded" />
        </div>
        <div class="mb-4">
          <label class="block">No Tlpn:</label>
          <input v-model="newUser.no_tlpn" class="w-full border px-2 py-1 rounded" />
        </div>
        <div class="mb-4" v-if="!isEditMode">
          <label class="block">Email:</label>
          <input v-model="newUser.email" class="w-full border px-2 py-1 rounded" type="email" />
        </div>
        <div class="mb-4" v-if="!isEditMode">
          <label class="block">Password:</label>
          <input v-model="newUser.password" class="w-full border px-2 py-1 rounded" type="password" />
        </div>
        <div class="flex justify-end">
          <button @click="saveUser" class="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">{{ isEditMode ? "Simpan Perubahan" : "Simpan" }}</button>
          <button @click="showPopup = false" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Batal</button>
        </div>
      </div>
    </div>

    <!-- Pop-up Edit Password -->
    <div v-if="showPasswordPopup" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-8 rounded shadow-md w-1/3">
        <h2 class="text-xl font-bold mb-4 text-center">Edit Password</h2>
        <div class="mb-4">
          <label class="block">Password Saat Ini:</label>
          <input v-model="currentPassword" class="w-full border px-2 py-1 rounded" type="password" />
        </div>
        <div class="mb-4">
          <label class="block">Password Baru:</label>
          <input v-model="newPassword" class="w-full border px-2 py-1 rounded" type="password" />
        </div>
        <div class="flex justify-end">
          <button @click="savePassword" class="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600">Simpan Password</button>
          <button @click="showPasswordPopup = false" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarViewAdmin from "@/components/NavbarViewAdmin.vue";
import { ref, onMounted } from "vue";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export default {
  components: {
    NavbarViewAdmin,
  },
  setup() {
    const users = ref([]);
    const db = getFirestore();
    const auth = getAuth();
    const showPopup = ref(false);
    const showPasswordPopup = ref(false);
    const isEditMode = ref(false);
    const currentPassword = ref("");
    const selectedUserId = ref(null);
    const newPassword = ref("");
    const newUser = ref({
      nama: "",
      alamat: "",
      no_tlpn: "",
      email: "",
      password: "",
      role: "user",
    });

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      users.value = [];
      querySnapshot.forEach((doc) => {
        users.value.push({ id: doc.id, ...doc.data() });
      });
    };

    const openCreatePopup = () => {
      isEditMode.value = false;
      newUser.value = { nama: "", alamat: "", no_tlpn: "", email: "", password: "", role: "user" };
      showPopup.value = true;
    };

    const openEditPopup = (user) => {
      isEditMode.value = true;
      selectedUserId.value = user.id;
      newUser.value = { nama: user.nama, alamat: user.alamat, no_tlpn: user.no_tlpn, email: user.email, password: "" };
      showPopup.value = true;
    };

    const openPasswordPopup = (user) => {
      selectedUserId.value = user.id;
      showPasswordPopup.value = true;
    };

    const saveUser = async () => {
      if (isEditMode.value) {
        const userRef = doc(db, "users", selectedUserId.value);
        await updateDoc(userRef, {
          nama: newUser.value.nama,
          alamat: newUser.value.alamat,
          no_tlpn: newUser.value.no_tlpn,
          email: newUser.value.email,
        });
      } else {
        try {
          const { email, password, nama, alamat, no_tlpn } = newUser.value;
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const userAuth = userCredential.user;

          await setDoc(doc(db, "users", userAuth.uid), {
            nama,
            alamat,
            no_tlpn,
            email,
            role: "user",
            uid: userAuth.uid,
          });
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }

      showPopup.value = false;
      fetchUsers();
    };

    const savePassword = async () => {
      if (!newPassword.value || typeof newPassword.value !== "string") {
        alert("Password baru tidak valid");
        return;
      }

      try {
        // Mengirimkan request ke server untuk mengubah password
        await fetch("/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: selectedUserId.value, // UID user yang dipilih
            newPassword: newPassword.value, // Password baru
          }),
        });
        alert("Password berhasil diubah");
        showPasswordPopup.value = false;
      } catch (error) {
        console.error("Error updating password:", error);
        alert("Error updating password: " + error.message);
      }
    };

    const deleteUser = async (id) => {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    };

    onMounted(() => {
      fetchUsers();
    });

    return {
      users,
      showPopup,
      showPasswordPopup,
      newUser,
      newPassword,
      currentPassword,
      isEditMode,
      openCreatePopup,
      openEditPopup,
      openPasswordPopup,
      saveUser,
      savePassword,
      deleteUser,
    };
  },
};
</script>
