<template>
  <NavbarView />
  <div class="border border-black w-full h-full p-4">
    <h1 class="text-2xl font-bold mb-4">Riwayat Pemesanan Anda</h1>
    <table class="min-w-full table-auto border-collapse border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="px-4 py-2 border border-gray-300">Nama</th>
          <th class="px-4 py-2 border border-gray-300">Tanggal Pemesanan</th>
          <th class="px-4 py-2 border border-gray-300">Tanggal Selesai</th>
          <th class="px-4 py-2 border border-gray-300">Jumlah</th>
          <th class="px-4 py-2 border border-gray-300">Harga Total</th>
          <th class="px-4 py-2 border border-gray-300">Status ACC</th>
          <th class="px-4 py-2 border border-gray-300">Keterangan ACC</th>
          <th class="px-4 py-2 border border-gray-300">Aksi</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
          <td class="px-4 py-2 border border-gray-300">{{ order.nama }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ order.order_date }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ order.finish_date }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ order.jumlah }}</td>
          <td class="px-4 py-2 border border-gray-300">Rp. {{ order.price }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ order.acc?.approved || "BELUM" }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ order.acc?.keterangan || "Belum di review" }}</td>
          <td class="px-4 py-2 border border-gray-300">
            <button @click="openEditPopup(order)" class="bg-blue-500 text-white p-2 rounded">Edit</button>
            <button @click="deleteOrder(order.id)" :disabled="order.acc?.approved === 'YA'" class="bg-red-500 text-white p-2 rounded ml-2">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- PopUp Form Edit -->
    <div v-if="selectedOrder" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <h1 class="text-2xl font-bold mb-4">Edit Pesanan</h1>
        <form class="grid grid-cols-4 gap-3" @submit.prevent="saveOrder">
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Nama:</label>
            <input v-model="selectedOrder.nama" type="text" disabled class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">No Telepon:</label>
            <input v-model="selectedOrder.no_tlpn" type="text" disabled class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Tanggal Pemesanan:</label>
            <input v-model="selectedOrder.order_date" type="date" class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Tanggal Selesai:</label>
            <input v-model="selectedOrder.finish_date" type="date" class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Size:</label>
            <select v-model="selectedOrder.ukuran" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Tinta:</label>
            <select v-model="selectedOrder.tinta" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>Pigment</option>
              <option>Water-based</option>
              <option>Superwhite</option>
              <option>Metalic</option>
              <option>Rubber</option>
              <option>Plastisol</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Finishing:</label>
            <select v-model="selectedOrder.finishing" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>Doff</option>
              <option>Kasar</option>
              <option>Glossy</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Lengan:</label>
            <select v-model="selectedOrder.lengan" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>Panjang</option>
              <option>Pendek</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Bahan:</label>
            <select v-model="selectedOrder.bahan" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>Cotton 24S</option>
              <option>Cotton 30S</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Jumlah:</label>
            <input v-model="selectedOrder.jumlah" type="number" class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Harga Total:</label>
            <input disabled v-model="selectedOrder.price" type="number" class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Keterangan:</label>
            <input v-model="selectedOrder.keterangan" type="text" class="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-4">
            <button type="submit" class="bg-blue-500 text-white p-2 rounded">Simpan</button>
            <button @click="cancelEdit" class="bg-gray-500 text-white p-2 rounded ml-2">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavbarView from "@/components/NavbarView.vue";

export default {
  components: {
    NavbarView,
  },
  setup() {
    const orders = ref([]);
    const selectedOrder = ref(null);
    const auth = getAuth();
    const db = getFirestore();
    const showSelectedOrder = ref(false);

    const fetchOrders = async (uid) => {
      try {
        const [ordersSnapshot, userOrderSnapshot] = await Promise.all([getDocs(collection(db, "orders")), getDoc(doc(db, "users", uid))]);

        let userName = "Unknown";
        if (userOrderSnapshot.exists()) {
          const userData = userOrderSnapshot.data();
          userName = userData.nama || "Unknown";
        }

        const fetchedOrders = [];
        ordersSnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.user_uid === uid) {
            fetchedOrders.push({ id: doc.id, ...data, nama: userName });
          }
        });

        orders.value = fetchedOrders;
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrders(user.uid);
      }
    });

    const openEditPopup = (order) => {
      selectedOrder.value = { ...order };
      showSelectedOrder.value = true;
    };

    const closeEditPopup = () => {
      showSelectedOrder.value = false;
    };

    const saveOrder = async () => {
      try {
        const orderRef = doc(db, "orders", selectedOrder.value.id);
        await updateDoc(orderRef, { ...selectedOrder.value });
        await fetchOrders(auth.currentUser.uid); // Refresh order list
        closeEditPopup();
      } catch (error) {
        console.error("Error updating order: ", error);
      }
    };

    const deleteOrder = async (orderId) => {
      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId));
        if (orderDoc.exists()) {
          const orderData = orderDoc.data();
          const produkId = orderData.produk_id;

          await deleteDoc(doc(db, "orders", orderId));

          const produkSnapshot = await getDocs(collection(db, "produk"));
          const produkToDelete = produkSnapshot.docs.find((p) => p.id === produkId);

          if (produkToDelete) {
            await deleteDoc(doc(db, "produk", produkToDelete.id)); // Hapus produk yang ditemukan
          }

          orders.value = orders.value.filter((order) => order.id !== orderId);
        } else {
          console.error("Order not found: ", orderId);
        }
      } catch (error) {
        console.error("Error deleting order: ", error);
      }
    };

    return {
      orders,
      selectedOrder,
      showSelectedOrder,
      openEditPopup,
      closeEditPopup,
      saveOrder,
      deleteOrder,
    };
  },
};
</script>
