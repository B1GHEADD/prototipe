<template>
  <nav class="flex justify-between items-center">
    <div class="p-2">
      <img class="size-16 rounded-full" src="../assets/img/logo.png" alt="" />
    </div>
    <div class="flex-1 text-center">
      <ul class="inline-flex gap-24 text-xl">
        <li><a href="/admin">Daftar Pesanan</a></li>
        <li><a href="/user-admin">Daftar User</a></li>
        <li><a href="/produk">Daftar Produk</a></li>
        <li>
          <a href=""> <button @click="$store.dispatch('logout')">Logout</button></a>
        </li>
        <!-- <li><a href="">Laporan</a></li> -->
      </ul>
    </div>
  </nav>
</template>

<script>
import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
  },
};
</script>
