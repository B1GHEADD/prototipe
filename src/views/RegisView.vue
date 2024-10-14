<script setup></script>

<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex h-3/4">
      <img class="h-full" src="/src/assets/img/logo.png" alt="" />
      <div class="h-full border border-black rounded-r-lg">
        <div>
          <h1 class="text-left p-3 text-3xl font-bold">Sign Up</h1>
          <form class="flex-row px-3" @submit.prevent="register">
            <div class="flex flex-col">
              <label>Nama</label>
              <input type="string" v-model="register_form.nama" placeholder="Masukan Nama" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex flex-col">
              <label>No Tlpn</label>
              <input type="integer" v-model="register_form.no_tlpn" placeholder="Masukan No Tlpn" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex flex-col">
              <label>Alamat</label>
              <input type="string" v-model="register_form.alamat" placeholder="Masukan Alamat" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex flex-col">
              <label>Email</label>
              <input type="email" v-model="register_form.email" placeholder="Masukan Email" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex flex-col">
              <label class="mt-2">Password</label>
              <input type="password" v-model="register_form.password" placeholder="Masukan Password" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex justify-center mt-4">
              <button class="bg-[#ffcc00] p-2 font-bold text-white rounded-md w-full">Submit</button>
            </div>
            <div class="text-center mt-2 text-sm">
              <h1 class="">Have account member ?</h1>
              <a class="text-[#ffcc00] font-bold underline" href="/">Sign In</a>
            </div>
          </form>
        </div>
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
