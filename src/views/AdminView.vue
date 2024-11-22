<template>
  <NavbarViewAdmin />
  <div class="text-2xl font-bold px-3" v-if="$store.state.user">Hei admin</div>
  <div>
    <h1 class="text-3xl font-bold mb-5 px-3">Daftar Pesanan</h1>
    <!-- Tabel Produk dan Pesanan -->
    <div class="w-full h-full p-3">
      <table class="min-w-full bg-white border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 px-4 border">Produk ID</th>
            <th class="py-2 px-4 border">Order ID</th>
            <th class="py-2 px-4 border">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(order, index) in orders" :key="order.id">
            <!-- Kolom Produk ID -->
            <td class="py-2 px-4 border text-center">{{ order.produk_id || "Tidak Diketahui" }}</td>

            <!-- Kolom Order ID -->
            <td class="py-2 px-4 border text-center">
              <button @click="togglePopup(index)" class="bg-blue-500 text-white font-medium rounded px-4 py-2">Pesanan ID: {{ order.id }}</button>
            </td>

            <!-- Kolom Status -->
            <td class="py-2 px-4 border text-center">
              <!-- Menampilkan status berdasarkan persentase progress -->
              <span>{{ orderStatuses[index] }}</span>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Popup menu -->
      <div v-for="(order, index) in orders" :key="'popup-' + order.id" class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-full dark:bg-gray-700">
        <div v-if="isPopupOpen(index)" class="fixed inset-0 flex items-center justify-center bg-white">
          <div class="grid grid-cols-2 py-2 w-3/4 text-sm text-gray-700">
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Nama : {{ order.nama }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">No Tlpn : {{ order.no_tlpn }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Order Date : {{ order.order_date }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Finish Date : {{ order.finish_date }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Ukuran : {{ order.ukuran }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Bahan : {{ order.bahan }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Tinta : {{ order.tinta }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Finishing : {{ order.finishing }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Lengan : {{ order.lengan }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Jumlah : {{ order.jumlah }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Keterangan : {{ order.keterangan }}</label>
            </div>
            <div class="text-lg font-bold">
              <label class="block px-4 py-2">Total Price : Rp.{{ order.price }}</label>
            </div>
            <div v-if="order.desain_depan" class="text-lg font-bold">
              <label class="block px-4 py-2">Desain Depan:</label>
              <img :src="order.desain_depan" alt="Desain Depan" class="px-3 w-64 h-64 object-scale-down" />
            </div>
            <div v-if="order.desain_belakang" class="text-lg font-bold">
              <label class="block px-4 py-2">Desain Belakang:</label>
              <img :src="order.desain_belakang" alt="Desain Belakang" class="px-3 w-64 h-64 object-scale-down" />
            </div>
          </div>
          <div>
            <div>
              <div class="mt-4">
                <label class="block text-lg font-bold">ACC Pemesanan</label>
                <div>
                  <label> <input type="radio" v-model="status[index].approved" value="YA" /> YA </label>
                  <label class="ml-4"> <input type="radio" v-model="status[index].approved" value="TIDAK" /> TIDAK </label>
                </div>
              </div>
              <!-- Keterangan ACC -->
              <div class="mt-1">
                <label class="block text-lg font-bold">Keterangan ACC Pemesanan</label>
                <textarea v-model="status[index].keterangan" class="w-full border border-gray-300 rounded-lg p-2"></textarea>
              </div>
              <h1 class="text-xl font-bold">Progres</h1>

              <div class="flex justify-center items-center my-5">
                <div class="relative">
                  <svg width="120" height="120" class="rotate-90">
                    <circle class="text-gray-300" stroke-width="8" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
                    <circle
                      class="text-blue-500"
                      stroke-width="8"
                      :stroke-dasharray="`${circumference} ${circumference}`"
                      :stroke-dashoffset="calculateStrokeOffset(index)"
                      stroke-linecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="50"
                      cx="60"
                      cy="60"
                    />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xl font-bold">{{ calculateProgressPercentage(index) }}%</span>
                  </div>
                </div>
              </div>
              <form class="mt-1" @submit.prevent="updateProgres(order.id, index)">
                <div class="flex justify-between items-center mt-3">
                  <label class="text-xl font-bold">Potong</label>
                  <input type="checkbox" v-model="progres[index].potong" @change="updateProgres(order.id, index)" />
                </div>
                <div class="flex justify-between items-center mt-3">
                  <label class="text-xl font-bold">Jahit</label>
                  <input type="checkbox" v-model="progres[index].jahit" @change="updateProgres(order.id, index)" />
                </div>
                <div class="flex justify-between items-center mt-3">
                  <label class="text-xl font-bold">Sablon</label>
                  <input type="checkbox" v-model="progres[index].sablon" @change="updateProgres(order.id, index)" />
                </div>
                <div class="flex justify-between items-center mt-3">
                  <label class="text-xl font-bold">Kemas</label>
                  <input type="checkbox" v-model="progres[index].kemas" @change="updateProgres(order.id, index)" />
                </div>
                <div class="flex items-center justify-between mt-4">
                  <button @click="saveAccData(order.id, index)" class="bg-blue-500 text-white font-bold py-2 px-4 rounded">Simpan</button>
                  <button @click="closePopup(index)" class="bg-red-500 text-white font-bold py-2 px-4 rounded">Tutup</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { getDocs, getDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/index";
import { useStore } from "vuex";
import NavbarViewAdmin from "@/components/NavbarViewAdmin.vue";

export default {
  components: {
    NavbarViewAdmin,
  },
  setup() {
    const store = useStore();
    const orders = ref([]);
    const status = ref([]);
    const progres = ref([]);
    const popups = ref([]);
    const circumference = 2 * Math.PI * 50;

    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const fetchedOrders = [];

        // Reset arrays
        orders.value = [];
        status.value = [];
        progres.value = [];
        popups.value = [];

        for (const docSnapshot of querySnapshot.docs) {
          const orderData = { id: docSnapshot.id, ...docSnapshot.data() };

          // Fetch user data from users collection based on user_uid
          if (orderData.user_uid) {
            const userDocRef = doc(db, "users", orderData.user_uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              orderData.nama = userDoc.data().nama;
              orderData.no_tlpn = userDoc.data().no_tlpn;
            } else {
              orderData.nama = "Tidak Diketahui";
              orderData.no_tlpn = "Tidak Diketahui";
            }
          }

          // Ambil data produk berdasarkan produk_id
          if (orderData.produk_id) {
            const productDocRef = doc(db, "produk", orderData.produk_id);
            const productDoc = await getDoc(productDocRef);
            if (productDoc.exists()) {
              const productData = productDoc.data();
              orderData.keterangan = productData.keterangan || "Tidak Diketahui"; // Ambil keterangan
              orderData.desain_depan = productData.desain_depan || "Tidak Diketahui"; // Ambil desain depan
              orderData.desain_belakang = productData.desain_belakang || "Tidak Diketahui"; // Ambil desain belakang
              // Ambil data tinta berdasarkan ID_categori_tinta
              const tintaDocRef = doc(db, "tinta", productData.ID_categori_tinta);
              const tintaDoc = await getDoc(tintaDocRef);
              orderData.tinta = tintaDoc.exists() ? tintaDoc.data().tinta : "Tidak Diketahui"; // Ambil tinta

              // Ambil data bahan, finishing, lengan, ukuran menggunakan cara yang sama
              const bahanDocRef = doc(db, "bahan", productData.ID_categori_bahan);
              const bahanDoc = await getDoc(bahanDocRef);
              orderData.bahan = bahanDoc.exists() ? bahanDoc.data().type : "Tidak Diketahui";

              const finishingDocRef = doc(db, "finishing", productData.ID_categori_finishing);
              const finishingDoc = await getDoc(finishingDocRef);
              orderData.finishing = finishingDoc.exists() ? finishingDoc.data().type : "Tidak Diketahui";

              const lenganDocRef = doc(db, "lengan", productData.ID_categori_lengan);
              const lenganDoc = await getDoc(lenganDocRef);
              orderData.lengan = lenganDoc.exists() ? lenganDoc.data().type : "Tidak Diketahui";

              const ukuranDocRef = doc(db, "ukuran", productData.ID_categori_ukuran);
              const ukuranDoc = await getDoc(ukuranDocRef);
              orderData.ukuran = ukuranDoc.exists() ? ukuranDoc.data().type : "Tidak Diketahui";
            } else {
              // Handle jika produk tidak ditemukan
              orderData.bahan = "Tidak Diketahui";
              orderData.finishing = "Tidak Diketahui";
              orderData.lengan = "Tidak Diketahui";
              orderData.keterangan = "Tidak Diketahui";
              orderData.tinta = "Tidak Diketahui";
              orderData.ukuran = "Tidak Diketahui";
              orderData.desain_depan = "Tidak Diketahui";
              orderData.desain_belakang = "Tidak Diketahui";
            }
          }

          fetchedOrders.push(orderData);

          // Load ACC data
          status.value.push({
            approved: orderData.status?.approved || "",
            keterangan: orderData.status?.keterangan || "",
          });

          // Load progress data
          progres.value.push({
            potong: orderData.progres?.potong || false,
            jahit: orderData.progres?.jahit || false,
            sablon: orderData.progres?.sablon || false,
            kemas: orderData.progres?.kemas || false,
          });

          popups.value.push(false);
        }
        orders.value = fetchedOrders;
      } catch (error) {
        console.error("Error fetching orders: ", error);
      }
    };

    const togglePopup = (index) => {
      popups.value[index] = !popups.value[index];
    };

    const isPopupOpen = (index) => {
      return popups.value[index];
    };

    const closePopup = (index) => {
      popups.value[index] = false;
    };
    const calculateStrokeOffset = (index) => {
      const totalSteps = Object.keys(progres.value[index]).length;
      const completedSteps = Object.values(progres.value[index]).filter(Boolean).length;

      if (totalSteps === 0) return circumference;

      const progressFraction = completedSteps / totalSteps;
      return circumference * (1 - progressFraction);
    };

    const calculateProgressPercentage = (index) => {
      const totalSteps = Object.keys(progres.value[index]).length;
      const completedSteps = Object.values(progres.value[index]).filter(Boolean).length;

      if (totalSteps === 0) return 0;

      return ((completedSteps / totalSteps) * 100).toFixed(0);
    };

    const orderStatuses = computed(() =>
      progres.value.map((progress) => {
        const totalSteps = Object.keys(progress).length;
        const completedSteps = Object.values(progress).filter(Boolean).length;
        const percentage = (completedSteps / totalSteps) * 100;
        return percentage === 100 ? "Complete" : "Incomplete";
      })
    );

    const saveAccData = async (orderId, index) => {
      try {
        const accData = {
          approved: status.value[index].approved,
          keterangan: status.value[index].keterangan,
        };

        await setDoc(doc(db, "orders", orderId), { status: accData }, { merge: true });
        alert("Data ACC berhasil disimpan!");
      } catch (error) {
        console.error("Error saving ACC data: ", error);
      }
    };

    const updateProgres = async (orderId, index) => {
      try {
        const progresData = progres.value[index];

        await setDoc(doc(db, "orders", orderId), { progres: progresData }, { merge: true });
      } catch (error) {
        console.error("Error updating progress: ", error);
      }
    };

    onMounted(() => {
      store.dispatch("fetchUser");
      fetchOrders();
    });

    return {
      orders,
      status,
      progres,
      popups,
      circumference,
      togglePopup,
      isPopupOpen,
      closePopup,
      calculateStrokeOffset,
      calculateProgressPercentage,
      orderStatuses,
      saveAccData,
      updateProgres,
    };
  },
};
</script>
