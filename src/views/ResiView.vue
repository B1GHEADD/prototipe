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
          <td class="px-4 py-2 border border-gray-300">{{ order.status?.approved || "BELUM" }}</td>
          <td class="px-4 py-2 border border-gray-300">{{ order.status?.keterangan || "Belum di review" }}</td>
          <td class="px-4 py-2 border border-gray-300">
            <button @click="openEditPopup(order)" class="bg-blue-500 text-white p-2 rounded">Edit</button>
            <button @click="deleteOrder(order.id)" :disabled="order.acc?.approved === 'YA'" class="bg-red-500 text-white p-2 rounded ml-2">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- PopUp Form Edit -->
    <div v-if="showSelectedOrder" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg">
        <h1 class="text-2xl font-bold mb-4">Edit Pesanan</h1>
        <form class="grid grid-cols-4 gap-3" @submit.prevent="editOrder">
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
            <select v-model="selectedOrder.ukuran_type" class="border border-black ml-auto rounded-md">
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
            <select v-model="selectedOrder.tinta_type" class="border border-black ml-auto rounded-md">
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
            <select v-model="selectedOrder.finishing_type" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>Doff</option>
              <option>Kasar</option>
              <option>Glossy</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Lengan:</label>
            <select v-model="selectedOrder.lengan_type" class="border border-black ml-auto rounded-md">
              <option disabled value="">Please select one</option>
              <option>Panjang</option>
              <option>Pendek</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-bold mb-2">Bahan:</label>
            <select v-model="selectedOrder.bahan_type" class="border border-black ml-auto rounded-md">
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
            <button @click="closeEditPopup" type="button" class="bg-gray-500 text-white p-2 rounded ml-2">Batal</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
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
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const userOrderSnapshot = await getDoc(doc(db, "users", uid));

        let userName = "Unknown";
        let tlpn = "";

        if (userOrderSnapshot.exists()) {
          const userData = userOrderSnapshot.data();
          userName = userData.nama || "Unknown";
          tlpn = userData.no_tlpn || "";
        }

        const fetchedOrders = [];
        for (const orderDoc of ordersSnapshot.docs) {
          const data = orderDoc.data();
          const produk_id = data.produk_id;

          if (data.user_uid === uid && produk_id) {
            const produkOrderSnapshot = await getDoc(doc(db, "produk", produk_id));

            let idTinta, idBahan, idUkuran, idLengan, idFinishing, keterangan;
            let tintaType = "",
              tintaHarga = 0;
            let bahanType = "",
              bahanHarga = 0;
            let ukuranType = "",
              ukuranHarga = 0;
            let lenganType = "",
              lenganHarga = 0;
            let finishingType = "",
              finishingHarga = 0;

            if (produkOrderSnapshot.exists()) {
              const produkData = produkOrderSnapshot.data();
              idTinta = produkData.ID_categori_tinta;
              idBahan = produkData.ID_categori_bahan;
              idUkuran = produkData.ID_categori_ukuran;
              idLengan = produkData.ID_categori_lengan;
              idFinishing = produkData.ID_categori_finishing;
              keterangan = produkData.keterangan;

              // Ambil data dari tabel tinta
              if (idTinta) {
                const tintaSnapshot = await getDoc(doc(db, "tinta", idTinta));
                if (tintaSnapshot.exists()) {
                  const tintaData = tintaSnapshot.data();
                  tintaType = tintaData.type;
                  tintaHarga = tintaData.harga;
                }
              }

              // Ambil data dari tabel bahan
              if (idBahan) {
                const bahanSnapshot = await getDoc(doc(db, "bahan", idBahan));
                if (bahanSnapshot.exists()) {
                  const bahanData = bahanSnapshot.data();
                  bahanType = bahanData.type;
                  bahanHarga = bahanData.harga;
                }
              }

              // Ambil data dari tabel ukuran
              if (idUkuran) {
                const ukuranSnapshot = await getDoc(doc(db, "ukuran", idUkuran));
                if (ukuranSnapshot.exists()) {
                  const ukuranData = ukuranSnapshot.data();
                  ukuranType = ukuranData.type;
                  ukuranHarga = ukuranData.harga;
                }
              }

              // Ambil data dari tabel lengan
              if (idLengan) {
                const lenganSnapshot = await getDoc(doc(db, "lengan", idLengan));
                if (lenganSnapshot.exists()) {
                  const lenganData = lenganSnapshot.data();
                  lenganType = lenganData.type;
                  lenganHarga = lenganData.harga;
                }
              }

              // Ambil data dari tabel finishing
              if (idFinishing) {
                const finishingSnapshot = await getDoc(doc(db, "finishing", idFinishing));
                if (finishingSnapshot.exists()) {
                  const finishingData = finishingSnapshot.data();
                  finishingType = finishingData.type;
                  finishingHarga = finishingData.harga;
                }
              }
            }

            fetchedOrders.push({
              id: orderDoc.id,
              ...data,
              nama: userName,
              no_tlpn: tlpn,
              id_tinta: idTinta,
              tinta_type: tintaType,
              tinta_harga: tintaHarga,
              id_bahan: idBahan,
              bahan_type: bahanType,
              bahan_harga: bahanHarga,
              id_ukuran: idUkuran,
              ukuran_type: ukuranType,
              ukuran_harga: ukuranHarga,
              id_lengan: idLengan,
              lengan_type: lenganType,
              lengan_harga: lenganHarga,
              id_finishing: idFinishing,
              finishing_type: finishingType,
              finishing_harga: finishingHarga,
              keterangan,
            });
          }
        }

        orders.value = fetchedOrders;
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    const openEditPopup = (order) => {
      selectedOrder.value = { ...order };
      showSelectedOrder.value = true;
      calculateTotalPrice();
    };

    const closeEditPopup = (order) => {
      selectedOrder.value = { ...order };
      showSelectedOrder.value = false;
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
            await deleteDoc(doc(db, "produk", produkToDelete.id));
          }

          orders.value = orders.value.filter((order) => order.id !== orderId);
        } else {
          console.error("Order not found: ", orderId);
        }
      } catch (error) {
        console.error("Error deleting order: ", error);
      }
    };

    const getIdByType = async (category, type) => {
      if (!type) return null;
      try {
        const q = query(collection(db, category), where("type", "==", type));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty ? querySnapshot.docs[0].id : null;
      } catch (error) {
        console.error(`Error getting ID for type "${type}" in category "${category}":`, error);
        return null;
      }
    };

    const editOrder = async () => {
      try {
        await calculateTotalPrice();
        const totalHarga = selectedOrder.value.price;

        await updateDoc(doc(db, "orders", selectedOrder.value.order_id), {
          finish_date: selectedOrder.value.finish_date,
          order_date: selectedOrder.value.order_date,
          jumlah: selectedOrder.value.jumlah,
          price: totalHarga,
        });

        const [tintaId, bahanId, ukuranId, lenganId, finishingId] = await Promise.all([
          getIdByType("tinta", selectedOrder.value.tinta_type),
          getIdByType("bahan", selectedOrder.value.bahan_type),
          getIdByType("ukuran", selectedOrder.value.ukuran_type),
          getIdByType("lengan", selectedOrder.value.lengan_type),
          getIdByType("finishing", selectedOrder.value.finishing_type),
        ]);

        await updateDoc(doc(db, "produk", selectedOrder.value.produk_id), {
          ID_categori_tinta: tintaId,
          ID_categori_bahan: bahanId,
          ID_categori_ukuran: ukuranId,
          ID_categori_lengan: lenganId,
          ID_categori_finishing: finishingId,
          keterangan: selectedOrder.value.keterangan || "",
        });

        await fetchOrders(auth.currentUser.uid); // Update orders list setelah penyimpanan
      } catch (error) {
        console.error("Error updating order:", error);
      }
    };

    onMounted(() => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await fetchOrders(user.uid);
        } else {
          console.log("User is not authenticated");
        }
      });
    });

    const getPrice = async (collectionName, type) => {
      try {
        if (!type) return 0; // Jika type kosong, kembalikan harga 0

        const q = query(collection(db, collectionName), where("type", "==", type));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          return querySnapshot.docs[0].data().harga;
        }
        return 0;
      } catch (error) {
        console.error("Error fetching price: ", error);
        return 0;
      }
    };

    const calculateTotalPrice = async () => {
      const { tinta_type, bahan_type, ukuran_type, lengan_type, finishing_type, jumlah } = selectedOrder.value;

      // Cek jika tipe belum terisi
      if (!tinta_type || !bahan_type || !ukuran_type || !lengan_type || !finishing_type) {
        console.warn("One or more types are missing");
        return;
      }

      let tintaHarga = await getPrice("tinta", tinta_type);
      let bahanHarga = await getPrice("bahan", bahan_type);
      let ukuranHarga = await getPrice("ukuran", ukuran_type);
      let lenganHarga = await getPrice("lengan", lengan_type);
      let finishingHarga = await getPrice("finishing", finishing_type);

      let total = (tintaHarga + bahanHarga + ukuranHarga + lenganHarga + finishingHarga) * jumlah;
      selectedOrder.value.price = total;

      watch(() => [selectedOrder.value.tinta_type, selectedOrder.value.bahan_type, selectedOrder.value.ukuran_type, selectedOrder.value.lengan_type, selectedOrder.value.finishing_type, selectedOrder.value.jumlah], calculateTotalPrice, {
        deep: true,
      });
    };

    return {
      orders,
      selectedOrder,
      showSelectedOrder,
      fetchOrders,
      openEditPopup,
      editOrder,
      closeEditPopup,
      deleteOrder,
    };
  },
};
</script>
