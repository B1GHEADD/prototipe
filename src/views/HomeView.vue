<template>
  <NavbarView />
  <div class="flex flex-col-2 md:flex-row border border-black justify-between w-full">
    <div class="md:w-1/2 p-2">
      <div class="text-2xl font-bold" v-if="$store.state.user">Selamat datang {{ order_form.nama }} Sablon Yogyakarta</div>
      <form class="grid grid-cols-1 sm:grid-cols-2 mt-3 gap-3 border border-black p-3 rounded-lg" @submit.prevent="inputOrder">
        <!-- Nama -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Nama</label>
          <input v-model="order_form.nama" disabled class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="text" placeholder="Masukan Nama" />
        </div>

        <!-- No Tlpn -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">No Tlpn</label>
          <input v-model="order_form.no_tlpn" disabled class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="text" placeholder="Masukan No Tlpn" />
        </div>

        <!-- Order Date -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Order Date</label>
          <input v-model="order_form.order_date" class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="date" />
        </div>

        <!-- Finish Date -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Finish Date</label>
          <input v-model="order_form.finish_date" class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="date" />
        </div>

        <!-- Ukuran -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Ukuran</label>
          <select v-model="order_form.ukuran" @change="calculateTotalPrice" class="border border-black px-2 py-1 rounded-md w-auto sm:w-2/3">
            <option disabled value="">Please select one</option>
            <option>XS</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
          </select>
        </div>

        <!-- Bahan -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Bahan</label>
          <select v-model="order_form.bahan" class="border border-black px-2 py-1 rounded-md w-auto sm:w-2/3">
            <option disabled value="">Please select one</option>
            <option>Cotton 24S</option>
            <option>Cotton 30S</option>
          </select>
        </div>

        <!-- Tinta -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Tinta</label>
          <select v-model="order_form.tinta" @change="calculateTotalPrice" class="border border-black px-2 py-1 rounded-md w-auto sm:w-2/3">
            <option disabled value="">Please select one</option>
            <option>Water-based</option>
            <option>Superwhite</option>
            <option>Plastisol</option>
          </select>
        </div>

        <!-- Finishing -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Finishing</label>
          <select v-model="order_form.finishing" class="border border-black px-2 py-1 rounded-md w-auto sm:w-2/3">
            <option disabled value="">Please select one</option>
            <option>Doff</option>
            <option>Kasar</option>
            <option>Glossy</option>
          </select>
        </div>

        <!-- Lengan -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Lengan</label>
          <select v-model="order_form.lengan" @change="calculateTotalPrice" class="border border-black px-2 py-1 rounded-md w-auto sm:w-2/3">
            <option disabled value="">Please select one</option>
            <option>Panjang</option>
            <option>Pendek</option>
          </select>
        </div>

        <!-- Jumlah -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Jumlah</label>
          <input v-model="order_form.jumlah" class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="number" placeholder="Masukan jumlah" />
        </div>

        <!-- Desain Depan -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Desain Depan</label>
          <input class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="file" @change="(event) => uploadDesain(event, 'desain_depan_url')" />
        </div>

        <!-- Desain Belakang -->
        <div class="flex flex-col sm:flex-row sm:items-center">
          <label class="font-bold text-md sm:w-1/3">Desain Belakang</label>
          <input class="border border-black px-2 py-1 rounded-md w-full sm:w-2/3" type="file" @change="(event) => uploadDesain(event, 'desain_belakang_url')" />
        </div>

        <!-- Keterangan -->
        <div class="flex flex-col gap-2 sm:col-span-2">
          <label class="font-bold text-lg">Keterangan</label>
          <textarea v-model="order_form.keterangan" class="border border-black px-3 py-2 rounded-md w-full h-44" placeholder="Keterangan"></textarea>
        </div>

        <!-- Submit -->
        <div class="flex justify-start sm:col-span-2">
          <button type="submit" class="bg-green-300 border border-black rounded-md px-8 py-3 text-lg w-full sm:w-1/2">Rp.{{ order_form.price }}</button>
        </div>
      </form>
    </div>
    <div class="flex-col items-center justify-center mt-4 w-1/2 hidden md:block">
      <div class="flex gap-4 mb-2 justify-center">
        <button class="border border-black p-1 w-20 rounded-lg bg-blue-300" @click="showFront">Depan</button>
        <button class="border border-black p-1 w-20 rounded-lg bg-blue-300" @click="showBack">Belakang</button>
      </div>
      <div class="mb-2 flex justify-center">
        <label for="colorInput">Pilih warna:</label>
        <input type="color" id="colorInput" v-model="color" class="ml-2 border border-black" />
      </div>
      <div class="mb-2 flex justify-center">
        <label for="fileInput">Unggah Gambar:</label>
        <input type="file" id="fileInput" @change="handleFileUpload" class="ml-2 border border-black" accept="image/*" />
      </div>
      <div class="flex gap-4 justify-center mb-3">
        <button class="border border-black p-1 w-58 rounded-lg bg-blue-300" @click="saveImageFront">Simpan Desain Depan</button>
        <button class="border border-black p-1 w-58 rounded-lg bg-blue-300" @click="saveImageBack">Simpan Desain Belakang</button>
      </div>
      <div class="flex gap-4 justify-center">
        <button class="border border-black p-1 w-30 rounded-lg bg-blue-300" @click="refreshPage">Refresh Page</button>
      </div>

      <div ref="designCanvasContainer" class="w-3/5 border border-black flex justify-center items-center relative mt-4 mx-auto">
        <div :style="{ backgroundColor: color }" class="w-full h-full absolute inset-0"></div>
        <img v-if="isFront" id="designCanvasFront" class="size-full absolute" src="../assets/img/bingkai.png" alt="Bingkai Depan" />
        <img v-else id="designCanvasBack" class="size-full absolute" src="../assets/img/bingkai-belakang.png" alt="Bingkai Belakang" />

        <v-stage v-if="isFront" ref="frontStage" :config="stageSize">
          <v-layer ref="frontLayer">
            <v-image v-for="(imgCfg, index) in imageConfigFront" :key="imgCfg.id" :id="imgCfg.id" :config="imgCfg" :image="imgCfg.image" @transformend="handleTransformEnd('front', index)" @mousedown="selectImage('front', index)" />
            <v-transformer ref="transformer" />
          </v-layer>
        </v-stage>

        <v-stage v-if="!isFront" ref="backStage" :config="stageSize">
          <v-layer ref="backLayer">
            <v-image v-for="(imgCfg, index) in imageConfigBack" :key="imgCfg.id" :id="imgCfg.id" :config="imgCfg" :image="imgCfg.image" @transformend="handleTransformEnd('back', index)" @mousedown="selectImage('back', index)" />
            <v-transformer ref="transformer" />
          </v-layer>
        </v-stage>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/index";
import html2canvas from "html2canvas";
import NavbarView from "@/components/NavbarView.vue";

export default {
  components: {
    NavbarView,
  },
  data() {
    return {
      isFront: true,
      color: "#ffffff",
      stageSize: {
        width: 400,
        height: 400,
      },
      imageFront: null,
      imageBack: null,
      imageConfigFront: [],
      imageConfigBack: [],
      selectedImageIndex: null,
      selectedImageName: "",
    };
  },
  async mounted() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        this.order_form.nama = userDoc.data().nama;
        this.order_form.no_tlpn = userDoc.data().no_tlpn;
      } else {
        console.log("No such document!");
      }
    }
  },

  methods: {
    refreshPage() {
      window.location.reload();
    },

    showFront() {
      this.isFront = true;
      this.updateTransformer();
    },

    showBack() {
      this.isFront = false;
      this.updateTransformer();
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const uploadedImage = new window.Image();
          uploadedImage.src = e.target.result;
          uploadedImage.onload = () => {
            const imageConfig = {
              id: this.isFront ? `front-${this.imageConfigFront.length + 1}` : `back-${this.imageConfigBack.length + 1}`,
              rotation: 0,
              x: (this.stageSize.width - uploadedImage.width) / 2,
              y: (this.stageSize.height - uploadedImage.height) / 2,
              width: uploadedImage.width,
              height: uploadedImage.height,
              scaleX: 1,
              scaleY: 1,
              image: uploadedImage,
              draggable: true,
            };

            if (this.isFront) {
              this.imageConfigFront.push(imageConfig);
            } else {
              this.imageConfigBack.push(imageConfig);
            }

            this.save();
          };
        };
        reader.readAsDataURL(file);
      }
    },

    handleTransformEnd(side, index) {
      const layer = side === "front" ? this.$refs.frontLayer.getNode() : this.$refs.backLayer.getNode();
      const img = layer.getChildren()[index];

      if (img) {
        const imgCfg = side === "front" ? this.imageConfigFront[index] : this.imageConfigBack[index];
        imgCfg.x = img.x();
        imgCfg.y = img.y();
        imgCfg.rotation = img.rotation();
        imgCfg.scaleX = img.scaleX();
        imgCfg.scaleY = img.scaleY();
        imgCfg.width = img.width() * img.scaleX();
        imgCfg.height = img.height() * img.scaleY();

        this.save();
      }
    },

    selectImage(side, index) {
      this.selectedImageIndex = index;
      this.selectedImageName = side === "front" ? "imageFront" : "imageBack";
      this.updateTransformer();
    },

    updateTransformer() {
      const transformerNode = this.$refs.transformer.getNode();
      const stage = transformerNode.getStage();
      const selectedImageConfig = this.isFront ? this.imageConfigFront[this.selectedImageIndex] : this.imageConfigBack[this.selectedImageIndex];

      if (selectedImageConfig) {
        const selectedNode = stage.findOne("#" + selectedImageConfig.id);

        if (selectedNode) {
          transformerNode.nodes([selectedNode]);
          transformerNode.getLayer().batchDraw();
        } else {
          transformerNode.nodes([]);
        }
      }
    },

    saveImageFront() {
      // Referensi ke elemen <div> yang berisi desain depan
      const designDiv = this.$refs.designCanvasContainer;

      // Gunakan html2canvas untuk menangkap elemen <div> dan menyimpan hasilnya
      html2canvas(designDiv).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg"); // Konversi ke format JPEG

        // Membuat link unduh dan mengunduh gambar
        const link = document.createElement("a");
        link.href = image;
        link.download = "desain-kaos-depan.jpg";
        link.click();
      });
    },

    saveImageBack() {
      // Referensi ke elemen <div> yang berisi desain belakang
      const designDiv = this.$refs.designCanvasContainer;

      // Gunakan html2canvas untuk menangkap elemen <div> dan menyimpan hasilnya
      html2canvas(designDiv).then((canvas) => {
        const image = canvas.toDataURL("image/jpeg"); // Konversi ke format JPEG

        // Membuat link unduh dan mengunduh gambar
        const link = document.createElement("a");
        link.href = image;
        link.download = "desain-kaos-belakang.jpg";
        link.click();
      });
    },
  },

  setup() {
    const order_form = ref({});
    const db = getFirestore(); // Inisialisasi Firestore
    const router = useRouter();
    const store = useStore();

    const fetchUserData = async (uid) => {
      const userDoc = doc(db, "users", uid); // Dapatkan referensi dokumen berdasarkan UID
      const userSnapshot = await getDoc(userDoc); // Ambil data pengguna

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        order_form.value.nama = userData.nama; // Isi inputan "Nama"
        order_form.value.no_tlpn = userData.no_tlpn; // Isi inputan "No Tlpn"
      } else {
        console.log("No such document!");
      }
    };

    async function fetchUkuranPrice(typeUkuran) {
      try {
        const ukuranCollection = collection(db, "ukuran");
        const ukuranQuery = query(ukuranCollection, where("type", "==", typeUkuran));
        const querySnapshot = await getDocs(ukuranQuery);

        if (!querySnapshot.empty) {
          let harga = 0,
            id = null; // Deklarasi variabel harga dan id
          querySnapshot.forEach((doc) => {
            harga = doc.data().harga;
            id = doc.id;
          });
          return { id, harga };
        } else {
          console.log("No matching documents found.");
          return { id: null, harga: 0 };
        }
      } catch (error) {
        console.error("Error fetching ukuran price: ", error);
        return { id: null, harga: 0 };
      }
    }

    async function fetchBahanPrice(typeBahan) {
      try {
        const bahanCollection = collection(db, "bahan");
        const bahanQuery = query(bahanCollection, where("type", "==", typeBahan));
        const querySnapshot = await getDocs(bahanQuery);

        if (!querySnapshot.empty) {
          let harga = 0,
            id = null;
          querySnapshot.forEach((doc) => {
            harga = doc.data().harga;
            id = doc.id;
          });
          return { id, harga };
        } else {
          console.log("No matching documents found.");
          return { id: null, harga: 0 };
        }
      } catch (error) {
        console.error("Error fetching bahan price: ", error);
        return { id: null, harga: 0 };
      }
    }

    async function fetchTintaPrice(typeTinta) {
      try {
        const tintaCollection = collection(db, "tinta");
        const tintaQuery = query(tintaCollection, where("type", "==", typeTinta));
        const querySnapshot = await getDocs(tintaQuery);

        if (!querySnapshot.empty) {
          let harga = 0,
            id = null;
          querySnapshot.forEach((doc) => {
            harga = doc.data().harga;
            id = doc.id;
          });
          return { id, harga };
        } else {
          console.log("No matching documents found.");
          return { id: null, harga: 0 };
        }
      } catch (error) {
        console.error("Error fetching Tinta price: ", error);
        return { id: null, harga: 0 };
      }
    }

    async function fetchFinishingPrice(typeFinishing) {
      try {
        const finishingCollection = collection(db, "finishing");
        const finishingQuery = query(finishingCollection, where("type", "==", typeFinishing));
        const querySnapshot = await getDocs(finishingQuery);

        if (!querySnapshot.empty) {
          let harga = 0,
            id = null;
          querySnapshot.forEach((doc) => {
            harga = doc.data().harga;
            id = doc.id;
          });
          return { id, harga };
        } else {
          console.log("No matching documents found.");
          return { id: null, harga: 0 };
        }
      } catch (error) {
        console.error("Error fetching Finishing price: ", error);
        return { id: null, harga: 0 };
      }
    }

    async function fetchLenganPrice(typeLengan) {
      try {
        const lenganCollection = collection(db, "lengan");
        const lenganQuery = query(lenganCollection, where("type", "==", typeLengan));
        const querySnapshot = await getDocs(lenganQuery);

        if (!querySnapshot.empty) {
          let harga = 0,
            id = null;
          querySnapshot.forEach((doc) => {
            harga = doc.data().harga;
            id = doc.id;
          });
          return { id, harga };
        } else {
          console.log("No matching documents found.");
          return { id: null, harga: 0 };
        }
      } catch (error) {
        console.error("Error fetching Lengan price: ", error);
        return { id: null, harga: 0 };
      }
    }

    const calculateTotalPrice = async () => {
      const ukuranData = await fetchUkuranPrice(order_form.value.ukuran);
      const bahanData = await fetchBahanPrice(order_form.value.bahan);
      const tintaData = await fetchTintaPrice(order_form.value.tinta);
      const finishingData = await fetchFinishingPrice(order_form.value.finishing);
      const lenganData = await fetchLenganPrice(order_form.value.lengan);

      order_form.value.ukuran_id = ukuranData.id;
      order_form.value.bahan_id = bahanData.id;
      order_form.value.tinta_id = tintaData.id;
      order_form.value.finishing_id = finishingData.id;
      order_form.value.lengan_id = lenganData.id;

      const jumlah = isNaN(parseInt(order_form.value.jumlah)) ? 0 : parseInt(order_form.value.jumlah);

      if (jumlah > 0) {
        order_form.value.price = (ukuranData.harga + bahanData.harga + tintaData.harga + finishingData.harga + lenganData.harga) * jumlah;
      } else {
        order_form.value.price = 0;
      }
    };

    const uploadDesain = async (event, field) => {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        alert("File yang diunggah harus berupa gambar.");
        return;
      }

      const storage = getStorage();
      const fileRef = storageRef(storage, `images/${file.name}`);

      try {
        const snapshot = await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);

        if (field === "desain_depan_url") {
          order_form.value.desain_depan_url = downloadURL;
        } else if (field === "desain_belakang_url") {
          order_form.value.desain_belakang_url = downloadURL;
        }
      } catch (error) {
        console.error(`Error uploading ${field} file:`, error);
      }
    };

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        order_form.value.user_uid = user.uid;
        fetchUserData(user.uid);
      } else {
        console.log("No user is signed in");
      }
    });

    const isFormComplete = () => {
      return (
        order_form.value.nama &&
        order_form.value.no_tlpn &&
        order_form.value.order_date &&
        order_form.value.finish_date &&
        order_form.value.ukuran &&
        order_form.value.bahan &&
        order_form.value.tinta &&
        order_form.value.finishing &&
        order_form.value.lengan &&
        order_form.value.jumlah &&
        order_form.value.desain_depan_url &&
        order_form.value.desain_belakang_url &&
        order_form.value.keterangan &&
        order_form.value.user_uid
      );
    };

    const inputOrder = () => {
      if (isFormComplete()) {
        store
          .dispatch("inputOrder", order_form.value)
          .then(() => router.push("/resi"))
          .catch((error) => console.error("Error submitting order:", error));
      } else {
        alert("Mohon isi semua field sebelum melakukan pemesanan.");
      }
    };

    watch(() => [order_form.value.ukuran, order_form.value.tinta, order_form.value.lengan, order_form.value.jumlah, order_form.value.bahan, order_form.value.finishing], calculateTotalPrice);

    return {
      order_form,
      calculateTotalPrice,
      uploadDesain,
      inputOrder,
      store,
    };
  },
};
</script>
