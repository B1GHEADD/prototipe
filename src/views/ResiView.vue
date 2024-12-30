<template>
  <NavbarView />
  <div class="border border-black w-full h-full p-4">
    <h1 class="text-2xl font-bold mb-4">Riwayat Pemesanan Anda</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="order in orders" :key="order.id" class="border border-gray-300 rounded-lg p-4 bg-white shadow hover:shadow-lg">
        <h2 class="font-bold text-lg mb-2">{{ order.nama }}</h2>
        <p><strong>Tanggal Pemesanan:</strong> {{ order.order_date }}</p>
        <p><strong>Tanggal Selesai:</strong> {{ order.finish_date }}</p>
        <p><strong>Jumlah:</strong> {{ order.jumlah }}</p>
        <p><strong>Harga Total:</strong> Rp. {{ order.price }}</p>
        <p><strong>Status ACC:</strong> {{ order.status?.approved || "BELUM" }}</p>
        <p><strong>Keterangan ACC:</strong> {{ order.status?.keterangan || "Belum di review" }}</p>
        <div class="flex justify-start space-x-2 mt-4">
          <button @click="openEditPopup(order)" :disabled="order.status?.approved === 'YA'" class="bg-yellow-300 text-white px-3 py-1 rounded disabled:opacity-50">Edit</button>
          <button @click="deleteOrder(order.id)" :disabled="order.status?.approved === 'YA'" class="bg-red-300 text-white px-3 py-1 rounded disabled:opacity-50">Hapus</button>
          <button @click="getPaymentToken(order.id)" v-if="order.status?.approved === 'YA'" class="bg-blue-300 text-white px-3 py-1 rounded">Bayar</button>
          <button @click="openResiPopup(order)" v-if="order.status?.keterangan === 'Lunas'" class="bg-green-300 text-white px-3 py-1 rounded">Resi</button>
          <button @click="fetchDataFromFirestoreByOrderIdforMidtrans(order.id)" class="bg-orange-300 text-white px-3 py-1 rounded">Cek</button>
        </div>
      </div>
    </div>

    <!-- PopUp Form Edit -->
    <div v-if="showSelectedOrder" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-4 rounded shadow-lg w-full max-w-4xl" style="max-height: 90vh; overflow-y: auto">
        <h1 class="text-xl font-semibold mb-4">Edit Pesanan</h1>
        <!-- Grid Responsif -->
        <form class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-3" @submit.prevent="editOrder">
          <!-- Nama -->
          <div>
            <label class="block text-sm font-semibold mb-1">Nama:</label>
            <input v-model="selectedOrder.nama" type="text" disabled class="w-full p-1 border border-gray-300 rounded text-sm" />
          </div>
          <!-- Nomor Telepon -->
          <div>
            <label class="block text-sm font-semibold mb-1">No Telepon:</label>
            <input v-model="selectedOrder.no_tlpn" type="text" disabled class="w-full p-1 border border-gray-300 rounded text-sm" />
          </div>
          <!-- Tanggal Pemesanan -->
          <div>
            <label class="block text-sm font-semibold mb-1">Tanggal Pemesanan:</label>
            <input v-model="selectedOrder.order_date" type="date" class="w-full p-1 border border-gray-300 rounded text-sm" />
          </div>
          <!-- Tanggal Selesai -->
          <div>
            <label class="block text-sm font-semibold mb-1">Tanggal Selesai:</label>
            <input v-model="selectedOrder.finish_date" type="date" class="w-full p-1 border border-gray-300 rounded text-sm" />
          </div>
          <!-- Size -->
          <div>
            <label class="block text-sm font-semibold mb-1">Size:</label>
            <select v-model="selectedOrder.ukuran_type" class="border border-black rounded-md w-full p-1 text-sm">
              <option disabled value="">Please select one</option>
              <option>XS</option>
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>
          <!-- Tinta -->
          <div>
            <label class="block text-sm font-semibold mb-1">Tinta:</label>
            <select v-model="selectedOrder.tinta_type" class="border border-black rounded-md w-full p-1 text-sm">
              <option disabled value="">Please select one</option>
              <option>Water-based</option>
              <option>Superwhite</option>
              <option>Plastisol</option>
            </select>
          </div>
          <!-- Finishing -->
          <div>
            <label class="block text-sm font-semibold mb-1">Finishing:</label>
            <select v-model="selectedOrder.finishing_type" class="border border-black rounded-md w-full p-1 text-sm">
              <option disabled value="">Please select one</option>
              <option>Doff</option>
              <option>Kasar</option>
              <option>Glossy</option>
            </select>
          </div>
          <!-- Lengan -->
          <div>
            <label class="block text-sm font-semibold mb-1">Lengan:</label>
            <select v-model="selectedOrder.lengan_type" class="border border-black rounded-md w-full p-1 text-sm">
              <option disabled value="">Please select one</option>
              <option>Panjang</option>
              <option>Pendek</option>
            </select>
          </div>
          <!-- Bahan -->
          <div>
            <label class="block text-sm font-semibold mb-1">Bahan:</label>
            <select v-model="selectedOrder.bahan_type" class="border border-black rounded-md w-full p-1 text-sm">
              <option disabled value="">Please select one</option>
              <option>Cotton 24S</option>
              <option>Cotton 30S</option>
            </select>
          </div>
          <!-- Desain Depan -->
          <div v-if="selectedOrder.desainDepan">
            <label class="block text-sm font-semibold mb-1">Desain Depan:</label>
            <img :src="selectedOrder.desainDepan" alt="Desain Depan" class="w-full h-auto max-w-xs mx-auto" />
          </div>
          <!-- Desain Belakang -->
          <div v-if="selectedOrder.desainBelakang">
            <label class="block text-sm font-semibold mb-1">Desain Belakang:</label>
            <img :src="selectedOrder.desainBelakang" alt="Desain Belakang" class="w-full h-auto max-w-xs mx-auto" />
          </div>
          <!-- Keterangan -->
          <div class="lg:col-span-1">
            <label class="block text-sm font-semibold mb-1">Keterangan:</label>
            <textarea v-model="selectedOrder.keterangan" class="w-full p-1 border border-gray-300 rounded text-sm h-36"></textarea>
          </div>
          <!-- Jumlah -->
          <div>
            <label class="block text-sm font-semibold mb-1">Jumlah:</label>
            <input v-model="selectedOrder.jumlah" type="number" class="w-full p-1 border border-gray-300 rounded text-sm" />
          </div>
          <!-- Harga Total -->
          <div>
            <label class="block text-sm font-semibold mb-1">Harga Total:</label>
            <input disabled v-model="selectedOrder.price" type="number" class="w-full p-1 border border-gray-300 rounded text-sm" />
          </div>
          <!-- Tombol -->
          <div class="mt-4 w-full flex sm:col-span-2 lg:col-span-3">
            <button type="submit" class="bg-blue-500 text-white py-1 px-4 rounded text-sm w-1/2">Simpan</button>
            <button @click="closeEditPopup" type="button" class="bg-gray-500 text-white py-1 px-4 rounded text-sm ml-2 w-1/2">Batal</button>
          </div>
        </form>
      </div>
    </div>

    <!-- PopUp Form Resi -->
    <div v-if="showResiPopup" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div class="bg-white p-5 rounded shadow-lg">
        <h2 class="text-xl font-bold mb-4">Form Resi</h2>
        <form class="grid grid-cols-2 gap-4">
          <!-- Informasi Produk dan Pesanan -->
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Produk ID:</label>
            <input v-model="selectedOrder.produk_id" type="text" disabled class="w-full px-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Order ID:</label>
            <input v-model="selectedOrder.id" type="text" disabled class="w-full px-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Harga:</label>
            <input v-model="selectedOrder.price" type="text" disabled class="w-full px-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Nama:</label>
            <input v-model="selectedOrder.nama" type="text" disabled class="w-full px-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">No Telepon:</label>
            <input v-model="selectedOrder.no_tlpn" type="text" disabled class="w-full px-2 border border-gray-300 rounded" />
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Alamat</label>
            <input v-model="selectedOrder.alamat" type="text" disabled class="w-full px-2 border border-gray-300 rounded" />
          </div>
          <!-- Gambar Desain Depan -->
          <div v-if="selectedOrder.desainDepan" class="mb-2">
            <label class="block text-md font-bold mb-2">Desain Depan:</label>
            <img :src="selectedOrder.desainDepan" alt="Desain Depan" class="w-52 h-52 object-scale-down" />
          </div>
          <!-- Gambar Desain Belakang -->
          <div v-if="selectedOrder.desainBelakang" class="mb-2">
            <label class="block text-md font-bold mb-2">Desain Belakang:</label>
            <img :src="selectedOrder.desainBelakang" alt="Desain Belakang" class="w-52 h-52 object-scale-down" />
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Progres</label>
            <!-- Menampilkan persentase progres -->
            <div>{{ progressPercentage }}%</div>
            <!-- Bar Progres -->
            <div class="relative pt-1">
              <div class="flex mb-2">
                <div class="flex-1 h-2 mb-3 rounded-full bg-gray-200" style="width: 100%">
                  <div class="h-full rounded-full bg-teal-500" :style="{ width: progressPercentage + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- Tombol Tindakan -->
          <div class="mb-2 flex items-center h-9 gap-5 mt-10">
            <button @click.prevent="printPdf" class="bg-green-500 text-white p-2 rounded">Cetak</button>
            <button @click="closeResiPopup" class="bg-red-500 text-white p-2 rounded">Tutup</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Div untuk Rendering PDF -->
    <div v-if="showResiPopup" id="hidden-content" class="absolute -top-[624.938rem] -left-[624.938rem] visible">
      <div class="p-5">
        <h2 class="text-xl font-bold mb-4">Form Resi</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Produk ID:</label>
            <div>{{ selectedOrder.produk_id }}</div>
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Order ID:</label>
            <div>{{ selectedOrder.id }}</div>
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Harga:</label>
            <div>{{ selectedOrder.price }}</div>
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Nama:</label>
            <div>{{ selectedOrder.nama }}</div>
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">No Telepon:</label>
            <div>{{ selectedOrder.no_tlpn }}</div>
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Alamat:</label>
            <div>{{ selectedOrder.alamat }}</div>
          </div>
          <div class="mb-2">
            <label class="block text-md font-bold mb-2">Progres:</label>
            <div>{{ progressPercentage }}%</div>
          </div>
          <div></div>
          <!-- Gambar -->
          <div v-if="selectedOrder.desainDepan" class="mb-2">
            <label class="block text-md font-bold mb-2">Desain Depan:</label>
            <img :src="selectedOrder.desainDepan" alt="Desain Depan" class="w-52 h-52 object-scale-down" />
          </div>
          <div v-if="selectedOrder.desainBelakang" class="mb-2">
            <label class="block text-md font-bold mb-2">Desain Belakang:</label>
            <img :src="selectedOrder.desainBelakang" alt="Desain Belakang" class="w-52 h-52 object-scale-down" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase/index";
import { jsPDF } from "jspdf";
import axios from "axios";
import html2canvas from "html2canvas";
import NavbarView from "@/components/NavbarView.vue";

export default {
  components: {
    NavbarView,
  },

  data() {
    return {
      productName: null,
      price: null,
      quantity: null,
    };
  },

  methods: {
    async printPdf() {
      const content = document.getElementById("hidden-content");

      if (content) {
        try {
          // Render elemen tersembunyi menggunakan html2canvas
          const canvas = await html2canvas(content, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");

          // Buat dokumen PDF
          const doc = new jsPDF("p", "mm", "a4");
          const pageWidth = doc.internal.pageSize.getWidth();
          const imgWidth = pageWidth - 20; // Margin 10mm kiri-kanan
          const imgHeight = (canvas.height / canvas.width) * imgWidth;

          doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
          doc.save("resi-pesanan.pdf");
        } catch (error) {
          console.error("Gagal mencetak PDF:", error);
        }
      } else {
        console.error("Elemen dengan id 'hidden-content' tidak ditemukan.");
      }
    },

    async fetchDataFromFirestoreByOrderId(order_id) {
      try {
        if (!order_id) {
          throw new Error("order_id tidak disediakan");
        }

        // Pastikan order_id adalah string atau angka, bukan objek
        order_id = String(order_id);

        // Query untuk mencari dokumen berdasarkan order_id
        const ordersRef = collection(db, "orders"); // Referensi ke koleksi orders
        const q = query(ordersRef, where("order_id", "==", order_id));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Ambil data dari dokumen pertama yang cocok
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          this.order_id = data.order_id;
          this.productName = data.produk_id;
          this.price = data.price;
          this.quantity = data.jumlah;
          console.log("Data fetched from Firestore:", data);
        } else {
          console.log("No document found with the specified order_id");
        }
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      }
    },

    async getPaymentToken(order_id) {
      try {
        // Ambil data dari Firestore berdasarkan order_id
        await this.fetchDataFromFirestoreByOrderId(order_id);

        // Kirim data ke backend untuk mendapatkan token
        const response = await axios.post("http://localhost:3000/", {
          order_id: this.order_id,
          productName: this.productName,
          price: this.price,
          quantity: this.quantity,
        });

        const token = response.data.token;
        console.log("Payment Token:", token);

        if (!token) {
          console.error("Payment token is missing or invalid.");
          return;
        }

        // Initialize Midtrans Snap popup
        window.snap.pay(token, {
          onSuccess: (result) => {
            console.log("Transaction successful:", result);
          },
          onPending: (result) => {
            console.log("Transaction pending:", result);
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
          },
          onClose: () => {
            console.log("Transaction canceled by the user");
          },
        });
      } catch (error) {
        console.error("Error fetching token:", error);
      }
    },
  },

  setup() {
    const orders = ref([]);
    const selectedOrder = ref(null);
    const auth = getAuth();
    const db = getFirestore();
    const showSelectedOrder = ref(false);
    const showResiPopup = ref(false);

    const fetchOrders = async (uid) => {
      try {
        const ordersSnapshot = await getDocs(collection(db, "orders"));
        const userOrderSnapshot = await getDoc(doc(db, "users", uid));

        let userName = "Unknown";
        let tlpn = "";
        let alamat = "";

        if (userOrderSnapshot.exists()) {
          const userData = userOrderSnapshot.data();
          userName = userData.nama || "Unknown";
          tlpn = userData.no_tlpn || "";
          alamat = userData.alamat || "";
        }

        const fetchedOrders = [];
        for (const orderDoc of ordersSnapshot.docs) {
          const data = orderDoc.data();
          const produk_id = data.produk_id;
          if (data.user_uid === uid && produk_id) {
            const produkOrderSnapshot = await getDoc(doc(db, "produk", produk_id));

            let idTinta, idBahan, idUkuran, idLengan, idFinishing, keterangan, desainDepan, desainBelakang;
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
              desainDepan = produkData.desain_depan;
              desainBelakang = produkData.desain_belakang;

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
              alamat: alamat,
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
              desainDepan,
              desainBelakang,
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

    const openResiPopup = (order) => {
      selectedOrder.value = { ...order };
      showResiPopup.value = true;
      calculateTotalPrice();
    };

    const closeResiPopup = (order) => {
      selectedOrder.value = { ...order };
      showResiPopup.value = false;
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

        closeEditPopup(); // Tutup pop-up setelah berhasil menyimpan
        this.$router.push("/"); // Arahkan ke halaman awal setelah penyimpanan berhasil
      } catch (error) {
        console.error("Error updating order:", error);
      }
    };

    const fetchDataFromFirestoreByOrderIdforMidtrans = async (orderId) => {
      try {
        // Mengambil data order dari Firestore berdasarkan orderId
        const orderDoc = await getDoc(doc(db, "orders", orderId));

        if (!orderDoc.exists) {
          alert("Order tidak ditemukan.");
          return;
        }

        const order = orderDoc.data();

        // Memeriksa apakah order masih dalam status "Lakukan pembayaran"
        if (order.status.keterangan === "Lunas") {
          alert("Order sudah lunas.");
          return;
        }

        // Menandai status loading
        order.loading = true; // Gunakan reactivity Vue jika perlu

        // Memanggil API Midtrans untuk mengecek status pembayaran
        const response = await fetch("http://localhost:3000/cek-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        });

        // Mengecek apakah request berhasil
        if (response.ok) {
          const data = await response.json();

          // Cek status transaksi yang diterima dari Midtrans
          if (data.transaction_status === "settlement") {
            // Jika status adalah "settlement", update status di Firestore
            await orderRef.update({
              "status.keterangan": "Lunas", // Mengubah status.keterangan menjadi 'Lunas'
              updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            });

            alert("Pembayaran telah selesai dan status diperbarui menjadi Lunas.");
          } else {
            alert(`Status transaksi saat ini: ${data.transaction_status}`);
          }
        } else {
          alert("Gagal memeriksa status pembayaran.");
        }
      } catch {
        window.location.reload(); // Refresh halaman untuk menampilkan perubahan terbaru
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

    const calculateProgressPercentage = (progressObject) => {
      if (!progressObject || typeof progressObject !== "object") {
        return 0; // Pastikan progres adalah objek
      }

      const progressArray = Object.values(progressObject);
      const totalSteps = progressArray.length;
      const completedSteps = progressArray.filter(Boolean).length;

      if (totalSteps === 0) return 0;

      return ((completedSteps / totalSteps) * 100).toFixed(0); // Menghasilkan persentase dalam bentuk string
    };

    const progressPercentage = computed(() => {
      watch(
        () => selectedOrder.value?.progres,
        (newProgress) => {
          // Recalculate progressPercentage jika ada perubahan pada progres
          progressPercentage.value = calculateProgressPercentage(newProgress);
        },
        { immediate: true } // Memastikan watcher dipicu pertama kali saat mount
      );

      // Pastikan selectedOrder.progres tidak undefined
      return selectedOrder.value && selectedOrder.value.progres ? calculateProgressPercentage(selectedOrder.value.progres) : 0;
    });

    return {
      orders,
      selectedOrder,
      showSelectedOrder,
      showResiPopup,
      fetchOrders,
      openEditPopup,
      closeEditPopup,
      openResiPopup,
      closeResiPopup,
      editOrder,
      deleteOrder,
      fetchDataFromFirestoreByOrderIdforMidtrans,
      calculateProgressPercentage,
      progressPercentage,
    };
  },
};
</script>
