<template>
  <div>
    <NavbarView />
    <div class="container mx-auto p-5">
      <h1 class="text-3xl font-bold mb-4 text-center md:text-left">Profil Pengguna</h1>
      <div class="bg-white p-5 rounded shadow-md" v-if="currentUser">
        <h2 class="text-xl font-semibold mb-4">Informasi Pribadi</h2>
        <div class="space-y-2">
          <p><strong>Nama:</strong> {{ currentUser.nama }}</p>
          <p><strong>Email:</strong> {{ currentUser.email }}</p>
          <p><strong>Alamat:</strong> {{ currentUser.alamat }}</p>
          <p><strong>Nomor Telepon:</strong> {{ currentUser.no_tlpn }}</p>
        </div>
        <button @click="openEditPopup" class="bg-blue-500 text-white px-4 py-2 mt-4 w-full md:w-auto">Edit Profil</button>
      </div>
    </div>

    <!-- Pop-up Form Edit -->
    <div v-if="showEditPopup" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
      <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Edit Profil</h2>
        <div class="mb-4">
          <label class="block">Nama:</label>
          <input v-model="editedUser.nama" class="w-full border px-2 py-1" />
        </div>
        <div class="mb-4">
          <label class="block">Alamat:</label>
          <input v-model="editedUser.alamat" class="w-full border px-2 py-1" />
        </div>
        <div class="mb-4">
          <label class="block">Nomor Telepon:</label>
          <input v-model="editedUser.no_tlpn" class="w-full border px-2 py-1" />
        </div>
        <div class="flex flex-col md:flex-row justify-end gap-2">
          <button @click="saveEdit" class="bg-green-500 text-white px-4 py-2">Simpan</button>
          <button @click="closeEditPopup" class="bg-red-500 text-white px-4 py-2">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import NavbarView from "@/components/NavbarView.vue";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  components: {
    NavbarView,
  },

  setup() {
    const currentUser = ref(null);
    const editedUser = ref({});
    const showEditPopup = ref(false);
    const db = getFirestore();
    const auth = getAuth();

    const fetchCurrentUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          currentUser.value = { id: user.uid, ...userDoc.data() };
        }
      }
    };

    const openEditPopup = () => {
      editedUser.value = { ...currentUser.value };
      showEditPopup.value = true;
    };

    const closeEditPopup = () => {
      showEditPopup.value = false;
    };

    const saveEdit = async () => {
      if (currentUser.value && editedUser.value) {
        const userRef = doc(db, "users", currentUser.value.id);
        await updateDoc(userRef, {
          nama: editedUser.value.nama,
          alamat: editedUser.value.alamat,
          no_tlpn: editedUser.value.no_tlpn,
        });
        currentUser.value = { ...editedUser.value };
        closeEditPopup();
      }
    };

    onMounted(() => {
      fetchCurrentUser();
    });

    return {
      currentUser,
      editedUser,
      showEditPopup,
      openEditPopup,
      closeEditPopup,
      saveEdit,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
