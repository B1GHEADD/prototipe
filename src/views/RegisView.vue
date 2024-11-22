<template>
  <div class="flex justify-center items-center min-h-screen px-4">
    <!-- Container -->
    <div class="flex flex-col md:flex-row items-center md:items-stretch h-auto w-full max-w-4xl border border-black rounded-lg overflow-hidden shadow-md">
      <!-- Logo -->
      <div class="h-40 md:h-auto w-full md:w-1/2 bg-gray-100 flex justify-center items-center">
        <!-- Tambahkan "justify-center items-center" pada div ini -->
        <img class="max-h-full max-w-full" src="/src/assets/img/logo.png" alt="Logo" />
      </div>

      <!-- Form -->
      <div class="w-full md:w-1/2 p-4 overflow-y-auto">
        <h1 class="text-left text-2xl font-bold mb-4">Sign Up</h1>
        <form class="space-y-4" @submit.prevent="register">
          <!-- Nama -->
          <div class="flex flex-col">
            <label>Nama</label>
            <input type="text" v-model="register_form.nama" placeholder="Masukkan Nama" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- No Tlpn -->
          <div class="flex flex-col">
            <label>No Tlpn</label>
            <input type="tel" v-model="register_form.no_tlpn" placeholder="Masukkan No Telepon" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- Alamat -->
          <div class="flex flex-col">
            <label>Alamat</label>
            <input type="text" v-model="register_form.alamat" placeholder="Masukkan Alamat" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- Email -->
          <div class="flex flex-col">
            <label>Email</label>
            <input type="email" v-model="register_form.email" placeholder="Masukkan Email" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- Password -->
          <div class="flex flex-col">
            <label>Password</label>
            <input type="password" v-model="register_form.password" placeholder="Masukkan Password" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center mt-4">
            <button type="submit" class="bg-[#ffcc00] p-2 font-bold text-white rounded-md w-full mb-4">Submit</button>
          </div>

          <!-- Additional Link -->
          <div class="text-center mt-4 text-sm">
            <p>
              Have an account?
              <a class="text-[#ffcc00] font-bold underline" href="/">Sign In</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const register_form = ref({});
    const store = useStore();

    const register = () => {
      store.dispatch("register", register_form.value);
    };

    return {
      register_form,
      register,
    };
  },
};
</script>
