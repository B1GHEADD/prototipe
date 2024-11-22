<template>
  <nav class="flex justify-between items-center p-4 bg-gray-800 text-white">
    <!-- Hamburger Menu Button (Mobile) -->
    <div class="lg:hidden">
      <button class="p-2 focus:outline-none" @click="toggleMenu" aria-label="Toggle Menu">
        <svg v-if="!isMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Navbar Links (Desktop) -->
    <div class="hidden lg:flex flex-1 justify-center">
      <ul class="inline-flex gap-24 text-xl">
        <li><a href="/profiel" class="hover:text-gray-300">Profil</a></li>
        <li><a href="/home" class="hover:text-gray-300">Pemesanan</a></li>
        <li><a href="/resi" class="hover:text-gray-300">Validasi</a></li>
        <li>
          <button @click="$store.dispatch('logout')" class="hover:text-gray-300">Logout</button>
        </li>
      </ul>
    </div>

    <!-- Logo -->
    <div>
      <img class="w-12 h-12 rounded-full" src="../assets/img/logo.png" alt="Logo" />
    </div>

    <!-- Navbar Links (Mobile) -->
    <div v-if="isMenuOpen" class="absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center lg:hidden">
      <ul class="w-full text-center">
        <li class="py-2 border-b border-gray-600"><a href="/profiel" class="block hover:bg-gray-700 py-2">Profil</a></li>
        <li class="py-2 border-b border-gray-600"><a href="/home" class="block hover:bg-gray-700 py-2">Pemesanan</a></li>
        <li class="py-2 border-b border-gray-600"><a href="/resi" class="block hover:bg-gray-700 py-2">Validasi</a></li>
        <li class="py-2">
          <button @click="$store.dispatch('logout')" class="block w-full text-left hover:bg-gray-700 py-2">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const isMenuOpen = ref(false);
    const store = useStore();

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    return {
      isMenuOpen,
      toggleMenu,
      store,
    };
  },
};
</script>
