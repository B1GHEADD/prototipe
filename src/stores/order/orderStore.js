import { addDoc, collection, updateDoc } from "firebase/firestore"; // Tambahkan updateDoc
import { db } from "../../firebase";

const orderStore = {
  state: {
    user_uid: "",
    nama: null,
    no_tlpn: null,
    order_date: null,
    finish_date: null,
    ukuran: null,
    bahan: null,
    tinta: null,
    finishing: null,
    lengan: null,
    desain_depan_url: null,
    desain_belakang_url: null,
    keterangan: null,
    price: 0,
    jumlah: null,
  },
  mutations: {
    SET_ORDER(state, details) {
      state.user_uid = details.user_uid;
      state.nama = details.nama;
      state.no_tlpn = details.no_tlpn;
      state.order_date = details.order_date;
      state.finish_date = details.finish_date;
      state.ukuran = details.ukuran;
      state.bahan = details.bahan;
      state.tinta = details.tinta;
      state.finishing = details.finishing;
      state.lengan = details.lengan;
      state.desain_depan_url = details.desain_depan_url;
      state.desain_belakang_url = details.desain_belakang_url;
      state.keterangan = details.keterangan;
      state.jumlah = details.jumlah;
      state.price = details.price;
    },
  },
  actions: {
    async inputOrder({ commit }, details) {
      try {
        // 1. Menambahkan data ke tabel produk terlebih dahulu
        const produkRef = await addDoc(collection(db, "produk"), {
          ID_categori_ukuran: details.ukuran_id, // Simpan ID Ukuran
          ID_categori_bahan: details.bahan_id, // Simpan ID Bahan
          ID_categori_tinta: details.tinta_id, // Simpan ID Tinta
          ID_categori_finishing: details.finishing_id, // Simpan ID Finishing
          ID_categori_lengan: details.lengan_id, // Simpan ID Lengan
          desain_depan: details.desain_depan_url, // Simpan URL Desain Depan
          desain_belakang: details.desain_belakang_url, // Simpan URL Desain Belakang
          keterangan: details.keterangan, // Simpan keterangan produk
        });

        // Dapatkan produk_uid yang baru ditambahkan
        const produk_uid = produkRef.id;

        // Menambahkan produk_id ke dokumen produk yang baru saja dibuat
        await updateDoc(produkRef, {
          produk_id: produk_uid, // Update dokumen dengan produk_id
        });

        // 2. Menambahkan data ke tabel orders dengan produk_uid dari produk yang baru saja ditambahkan
        const orderRef = await addDoc(collection(db, "orders"), {
          user_uid: details.user_uid, // Simpan User UID
          produk_id: produk_uid, // Simpan referensi ke produk
          jumlah: details.jumlah, // Simpan jumlah produk yang dipesan
          order_date: details.order_date, // Simpan tanggal pesanan
          finish_date: details.finish_date, // Simpan tanggal penyelesaian
          price: details.price,
        });

        // Dapatkan order_uid yang baru ditambahkan
        const order_uid = orderRef.id;

        // Menambahkan order_id ke dokumen orders yang baru saja dibuat
        await updateDoc(orderRef, {
          order_id: order_uid, // Update dokumen dengan order_id
        });

        // 3. Komit data ke state Vuex
        commit("SET_ORDER", details);

        console.log("Order berhasil ditambahkan dengan ID: ", orderRef.id);
      } catch (error) {
        console.error("Gagal menyimpan data: ", error);
      }
    },
  },
};

export default orderStore;
