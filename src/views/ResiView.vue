<template>
  <NavbarView />
  <div class="border border-black w-full h-full">
    <h1 class="text-2xl font-bold mb-4">Riwayat Pemesanan Anda</h1>
    <table class="min-w-full table-auto">
      <thead>
        <tr>
          <th class="px-4 py-2">Nama</th>
          <th class="px-4 py-2">Tanggal Pemesanan</th>
          <th class="px-4 py-2">Tanggal Selesai</th>
          <th class="px-4 py-2">Ukuran</th>
          <th class="px-4 py-2">Jumlah</th>
          <th class="px-4 py-2">Harga Total</th>
          <th class="px-4 py-2">Status ACC</th>
          <th class="px-4 py-2">Keterangan ACC</th>
          <th class="px-4 py-2">Aksi</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="order in orders" :key="order.id" class="border-t">
          <td class="px-4 py-2">{{ order.nama }}</td>
          <td class="px-4 py-2">{{ order.order_date }}</td>
          <td class="px-4 py-2">{{ order.finish_date }}</td>
          <td class="px-4 py-2">{{ order.ukuran }}</td>
          <td class="px-4 py-2">{{ order.jumlah }}</td>
          <td class="px-4 py-2">Rp. {{ order.price }}</td>
          <td class="px-4 py-2">{{ order.acc?.approved || "BELUM" }}</td>
          <td class="px-4 py-2">{{ order.acc?.keterangan || "Belum di review" }}</td>
          <td class="px-4 py-2">
            <button @click="popUpEdit(order)" class="bg-blue-500 text-white p-2 rounded">Edit</button>
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
import { ref, watch } from "vue";
import { getFirestore, collection, query, where, getDocs, doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavbarView from "@/components/NavbarView.vue";

export default {
  components: {
    NavbarView,
  },

  setup() {
    const orders = ref([]);
    const selectedOrder = ref(null);
    const db = getFirestore();
    const auth = getAuth();

    const fetchOrders = async (uid) => {
      const ordersQuery = query(collection(db, "orders"), where("user_uid", "==", uid));
      const querySnapshot = await getDocs(ordersQuery);
      orders.value = [];

      for (const orderDoc of querySnapshot.docs) {
        const orderData = orderDoc.data();
        const userRef = doc(db, "users", orderData.user_uid);
        const userSnapshot = await getDoc(userRef);

        let userData = {};
        if (userSnapshot.exists()) {
          userData = userSnapshot.data();
        }

        // Fetch ukuran
        let ukuranType = "Ukuran tidak tersedia";
        if (orderData.produk_id) {
          const produkRefUkuran = doc(db, "produk", orderData.produk_id);
          const produkSnapshotUkuran = await getDoc(produkRefUkuran);
          if (produkSnapshotUkuran.exists()) {
            const produkDataUkuran = produkSnapshotUkuran.data();
            if (produkDataUkuran.ID_categori_ukuran) {
              const ukuranRef = doc(db, "ukuran", produkDataUkuran.ID_categori_ukuran);
              const ukuranSnapshot = await getDoc(ukuranRef);
              if (ukuranSnapshot.exists()) {
                const ukuranData = ukuranSnapshot.data();
                ukuranType = ukuranData.type || "Ukuran tidak diketahui";
              }
            }
          }
        }

        // Fetch tinta
        let tintaType = "Tinta tidak tersedia";
        if (orderData.produk_id) {
          const produkRef = doc(db, "produk", orderData.produk_id);
          const produkSnapshot = await getDoc(produkRef);
          if (produkSnapshot.exists()) {
            const produkData = produkSnapshot.data();
            if (produkData.ID_categori_tinta) {
              const tintaRef = doc(db, "tinta", produkData.ID_categori_tinta);
              const tintaSnapshot = await getDoc(tintaRef);
              if (tintaSnapshot.exists()) {
                const tintaData = tintaSnapshot.data();
                tintaType = tintaData.type || "Tinta tidak diketahui";
              }
            }
          }
        }

        // Fetch bahan
        let bahanType = "Bahan tidak tersedia";
        if (orderData.produk_id) {
          const produkRef = doc(db, "produk", orderData.produk_id);
          const produkSnapshot = await getDoc(produkRef);
          if (produkSnapshot.exists()) {
            const produkData = produkSnapshot.data();
            if (produkData.ID_categori_bahan) {
              const bahanRef = doc(db, "bahan", produkData.ID_categori_bahan);
              const bahanSnapshot = await getDoc(bahanRef);
              if (bahanSnapshot.exists()) {
                const bahanData = bahanSnapshot.data();
                bahanType = bahanData.type || "Bahan tidak diketahui";
              }
            }
          }
        }

        // Fetch finishing
        let finishingType = "Finishing tidak tersedia";
        if (orderData.produk_id) {
          const produkRef = doc(db, "produk", orderData.produk_id);
          const produkSnapshot = await getDoc(produkRef);
          if (produkSnapshot.exists()) {
            const produkData = produkSnapshot.data();
            if (produkData.ID_categori_finishing) {
              const finishingRef = doc(db, "finishing", produkData.ID_categori_finishing);
              const finishingSnapshot = await getDoc(finishingRef);
              if (finishingSnapshot.exists()) {
                const finishingData = finishingSnapshot.data();
                finishingType = finishingData.type || "Finishing tidak diketahui";
              }
            }
          }
        }

        // Fetch lengan
        let lenganType = "Lengan tidak tersedia";
        if (orderData.produk_id) {
          const produkRef = doc(db, "produk", orderData.produk_id);
          const produkSnapshot = await getDoc(produkRef);
          if (produkSnapshot.exists()) {
            const produkData = produkSnapshot.data();
            if (produkData.ID_categori_lengan) {
              const lenganRef = doc(db, "lengan", produkData.ID_categori_lengan);
              const lenganSnapshot = await getDoc(lenganRef);
              if (lenganSnapshot.exists()) {
                const lenganData = lenganSnapshot.data();
                lenganType = lenganData.type || "Lengan tidak diketahui";
              }
            }
          }
        }

        // Fetch Keterangan
        let keteranganProduk = "Keterangan tidak tersedia";
        if (orderData.produk_id) {
          const produkRef = doc(db, "produk", orderData.produk_id);
          const produkSnapshot = await getDoc(produkRef);
          if (produkSnapshot.exists()) {
            const produkData = produkSnapshot.data();
            if (produkData.keterangan) {
              keteranganProduk = produkData.keterangan; // Mengambil keterangan langsung dari tabel produk
            }
          }
        }

        // Add order data to array
        orders.value.push({
          id: orderDoc.id,
          nama: userData.nama || "Nama tidak ditemukan",
          no_tlpn: userData.no_tlpn || "No telepon tidak ditemukan",
          order_date: orderData.order_date,
          finish_date: orderData.finish_date,
          ukuran: ukuranType,
          tinta: tintaType,
          bahan: bahanType,
          finishing: finishingType,
          lengan: lenganType,
          jumlah: orderData.jumlah,
          price: orderData.price,
          keterangan: keteranganProduk,
          acc: orderData.acc || {}, // Set default empty object
        });
      }
    };

    const deleteOrder = async (orderId) => {
      try {
        await deleteDoc(doc(db, "orders", orderId));
        orders.value = orders.value.filter((order) => order.id !== orderId);
      } catch (error) {
        console.error("Error deleting order:", error);
      }
    };

    const popUpEdit = (order) => {
      selectedOrder.value = { ...order };
    };

    const cancelEdit = () => {
      selectedOrder.value = null;
    };

    const saveOrder = async () => {
      if (!selectedOrder.value) return;

      // Get new category IDs based on selected types
      const newID_categori_bahan = await getCategoryId(selectedOrder.value.bahan, "bahan");
      const newID_categori_tinta = await getCategoryId(selectedOrder.value.tinta, "tinta");
      const newID_categori_finishing = await getCategoryId(selectedOrder.value.finishing, "finishing");
      const newID_categori_lengan = await getCategoryId(selectedOrder.value.lengan, "lengan");
      const newID_categori_ukuran = await getCategoryId(selectedOrder.value.ukuran, "ukuran");

      const orderRef = doc(db, "orders", selectedOrder.value.id);
      try {
        await updateDoc(orderRef, {
          order_date: selectedOrder.value.order_date,
          finish_date: selectedOrder.value.finish_date,
          ukuran: selectedOrder.value.ukuran,
          tinta: selectedOrder.value.tinta,
          bahan: selectedOrder.value.bahan,
          finishing: selectedOrder.value.finishing,
          lengan: selectedOrder.value.lengan,
          jumlah: selectedOrder.value.jumlah,
          price: selectedOrder.value.price,
          keterangan: selectedOrder.value.keterangan,
          ID_categori_bahan: newID_categori_bahan, // Update the category ID
          ID_categori_tinta: newID_categori_tinta, // Update the category ID
          ID_categori_finishing: newID_categori_finishing, // Update the category ID
          ID_categori_lengan: newID_categori_lengan, // Update the category ID
          ID_categori_ukuran: newID_categori_ukuran, // Update the category ID
        });
        // Update the order in the local array
        const index = orders.value.findIndex((order) => order.id === selectedOrder.value.id);
        if (index !== -1) {
          orders.value[index] = { ...selectedOrder.value };
        }
        // Reset selectedOrder
        selectedOrder.value = null;
      } catch (error) {
        console.error("Error updating order:", error);
      }
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchOrders(user.uid);
      } else {
        // Handle user not logged in
      }
    });

    const calculateTotalPrice = async () => {
      if (!selectedOrder.value) return;

      let hargaUkuran = 0,
        hargaTinta = 0,
        hargaBahan = 0,
        hargaFinishing = 0,
        hargaLengan = 0;

      // Fetch harga berdasarkan ukuran
      if (selectedOrder.value.ukuran) {
        const ukuranQuery = query(collection(db, "ukuran"), where("type", "==", selectedOrder.value.ukuran));
        const ukuranSnapshot = await getDocs(ukuranQuery);
        ukuranSnapshot.forEach((doc) => {
          hargaUkuran = doc.data().harga || 0;
        });
      }

      // Fetch harga berdasarkan tinta
      if (selectedOrder.value.tinta) {
        const tintaQuery = query(collection(db, "tinta"), where("type", "==", selectedOrder.value.tinta));
        const tintaSnapshot = await getDocs(tintaQuery);
        tintaSnapshot.forEach((doc) => {
          hargaTinta = doc.data().harga || 0;
        });
      }

      // Fetch harga berdasarkan bahan
      if (selectedOrder.value.bahan) {
        const bahanQuery = query(collection(db, "bahan"), where("type", "==", selectedOrder.value.bahan));
        const bahanSnapshot = await getDocs(bahanQuery);
        bahanSnapshot.forEach((doc) => {
          hargaBahan = doc.data().harga || 0;
        });
      }

      // Fetch harga berdasarkan finishing
      if (selectedOrder.value.finishing) {
        const finishingQuery = query(collection(db, "finishing"), where("type", "==", selectedOrder.value.finishing));
        const finishingSnapshot = await getDocs(finishingQuery);
        finishingSnapshot.forEach((doc) => {
          hargaFinishing = doc.data().harga || 0;
        });
      }

      // Fetch harga berdasarkan lengan
      if (selectedOrder.value.lengan) {
        const lenganQuery = query(collection(db, "lengan"), where("type", "==", selectedOrder.value.lengan));
        const lenganSnapshot = await getDocs(lenganQuery);
        lenganSnapshot.forEach((doc) => {
          hargaLengan = doc.data().harga || 0;
        });
      }

      // Hitung harga total
      const jumlah = selectedOrder.value.jumlah || 1;
      selectedOrder.value.price = (hargaUkuran + hargaTinta + hargaBahan + hargaFinishing + hargaLengan) * jumlah;
    };

    // Jalankan fungsi ini setiap kali terjadi perubahan
    // watch(() => [selectedOrder.value.ukuran, selectedOrder.value.tinta, selectedOrder.value.bahan, selectedOrder.value.finishing, selectedOrder.value.lengan, selectedOrder.value.jumlah], calculateTotalPrice);

    return {
      orders,
      selectedOrder,
      deleteOrder,
      popUpEdit,
      cancelEdit,
      saveOrder,
    };
  },
};
</script>
