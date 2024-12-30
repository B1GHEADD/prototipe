<template>
  <NavbarViewAdmin />
  <div class="container mx-auto">
    <nav class="flex justify-between items-center">
      <div class="flex-1 text-center">
        <ul class="inline-flex gap-24 text-md">
          <!-- Item Tinta -->
          <li class="flex flex-col items-center">
            <button @click="showTable('tinta')" class="flex flex-col items-center">
              Tinta
              <img src="../assets/img/icon-tinta.jpg" alt="Tinta Icon" class="w-5 h-5 mt-1" />
            </button>
          </li>
          <!-- Item Bahan dan Finishing -->
          <li class="flex flex-col items-center">
            <button @click="showTable('bahan')" class="flex flex-col items-center">
              Bahan dan Finishing
              <img src="../assets/img/icon-kain.jpg" alt="Bahan dan Finishing Icon" class="w-5 h-5 mt-1" />
            </button>
          </li>
          <!-- Item Ukuran dan Lengan -->
          <li class="flex flex-col items-center">
            <button @click="showTable('size')" class="flex flex-col items-center">
              Ukuran dan Lengan
              <img src="../assets/img/icon-size.png" alt="Ukuran dan Lengan Icon" class="w-5 h-5 mt-1" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
    <div v-show="activeTable === 'tinta'">
      <h1 class="text-2xl font-bold mb-4">Daftar Tinta</h1>
      <!-- Tombol Tambah Tinta -->
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" @click="openAddModal">Tambah Tinta</button>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-200">ID Tinta</th>
            <th class="py-2 px-4 bg-gray-200">Jenis Tinta</th>
            <th class="py-2 px-4 bg-gray-200">Harga</th>
            <th class="py-2 px-4 bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tinta in tintaList" :key="tinta.id">
            <td class="border px-4 py-2">{{ tinta.id }}</td>
            <td class="border px-4 py-2">{{ tinta.type }}</td>
            <td class="border px-4 py-2">{{ tinta.harga }}</td>
            <td class="border px-4 py-2">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" @click="editTinta(tinta)">Edit</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2" @click="deleteTinta(tinta.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal untuk Add Tinta -->
      <div v-if="tintaAdding" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Tambah Tinta Baru</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Tinta:</label>
              <input v-model="newTinta.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="newTinta.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="addTinta" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Tambah</button>
              <button @click="cancelAdd" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal untuk Edit Tinta -->
      <div v-if="tintaEditing" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Edit Tinta</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Tinta:</label>
              <input v-model="selectedTinta.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="selectedTinta.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="updateTinta" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Simpan</button>
              <button @click="cancelEdit" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTable === 'bahan'">
      <h1 class="text-2xl font-bold mb-4">Daftar Bahan</h1>
      <!-- Tombol Tambah Bahan -->
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" @click="openAddModalBahan">Tambah Bahan</button>
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-200">ID Bahan</th>
            <th class="py-2 px-4 bg-gray-200">Jenis Bahan</th>
            <th class="py-2 px-4 bg-gray-200">Harga</th>
            <th class="py-2 px-4 bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bahan in bahanList" :key="bahan.id">
            <td class="border px-4 py-2">{{ bahan.id }}</td>
            <td class="border px-4 py-2">{{ bahan.type }}</td>
            <td class="border px-4 py-2">{{ bahan.harga }}</td>
            <td class="border px-4 py-2">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" @click="editBahan(bahan)">Edit</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2" @click="deleteBahan(bahan.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal untuk Add Bahan -->
      <div v-if="bahanAdding" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Tambah Bahan Baru</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Bahan:</label>
              <input v-model="newBahan.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="newBahan.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="addBahan" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Tambah</button>
              <button @click="cancelAddBahan" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal untuk Edit Bahan -->
      <div v-if="bahanEditing" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Edit Bahan</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Bahan:</label>
              <input v-model="selectedBahan.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="selectedBahan.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="updateBahan" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Simpan</button>
              <button @click="cancelEditBahan" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTable === 'bahan'">
      <h1 class="text-2xl font-bold mb-4">Daftar Finishing</h1>
      <!-- Tombol Tambah Finishing -->
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" @click="openAddModalFinishing">Tambah Finishing</button>

      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-200">ID Finishing</th>
            <th class="py-2 px-4 bg-gray-200">Jenis Finishing</th>
            <th class="py-2 px-4 bg-gray-200">Harga</th>
            <th class="py-2 px-4 bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="finishing in finishingList" :key="finishing.id">
            <td class="border px-4 py-2">{{ finishing.id }}</td>
            <td class="border px-4 py-2">{{ finishing.type }}</td>
            <td class="border px-4 py-2">{{ finishing.harga }}</td>
            <td class="border px-4 py-2">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" @click="editFinishing(finishing)">Edit</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2" @click="deleteFinishing(finishing.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal untuk Add Finishing -->
      <div v-if="finishingAdding" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Tambah Finishing Baru</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Finishing:</label>
              <input v-model="newFinishing.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="newFinishing.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="addFinishing" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Tambah</button>
              <button @click="cancelAddFinishing" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal untuk Edit Finishing -->
      <div v-if="finishingEditing" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Edit Finishing</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Finishing:</label>
              <input v-model="selectedFinishing.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="selectedFinishing.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="updateFinishing" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Simpan</button>
              <button @click="cancelEditFinishing" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTable === 'size'">
      <h1 class="text-2xl font-bold mb-4">Daftar Size</h1>
      <!-- Tombol Tambah Size -->
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" @click="openAddModalSize">Tambah Size</button>

      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-200">ID Size</th>
            <th class="py-2 px-4 bg-gray-200">Jenis Size</th>
            <th class="py-2 px-4 bg-gray-200">Harga</th>
            <th class="py-2 px-4 bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="size in sizeList" :key="size.id">
            <td class="border px-4 py-2">{{ size.id }}</td>
            <td class="border px-4 py-2">{{ size.type }}</td>
            <td class="border px-4 py-2">{{ size.harga }}</td>
            <td class="border px-4 py-2">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" @click="editSize(size)">Edit</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2" @click="deleteSize(size.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal untuk Add Size -->
      <div v-if="sizeAdding" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Tambah Size Baru</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Size:</label>
              <input v-model="newSize.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="newSize.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="addSize" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Tambah</button>
              <button @click="cancelAddSize" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal untuk Edit Size -->
      <div v-if="sizeEditing" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Edit Size</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Size:</label>
              <input v-model="selectedSize.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="selectedSize.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="updateSize" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Simpan</button>
              <button @click="cancelEditSize" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-show="activeTable === 'size'">
      <h1 class="text-2xl font-bold mb-4">Daftar Lengan</h1>
      <!-- Tombol Tambah Lengan -->
      <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4" @click="openAddModalLengan">Tambah Jenis Lengan</button>

      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-4 bg-gray-200">ID Jenis Lengan</th>
            <th class="py-2 px-4 bg-gray-200">Jenis Lengan</th>
            <th class="py-2 px-4 bg-gray-200">Harga</th>
            <th class="py-2 px-4 bg-gray-200">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lengan in lenganList" :key="lengan.id">
            <td class="border px-4 py-2">{{ lengan.id }}</td>
            <td class="border px-4 py-2">{{ lengan.type }}</td>
            <td class="border px-4 py-2">{{ lengan.harga }}</td>
            <td class="border px-4 py-2">
              <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" @click="editLengan(lengan)">Edit</button>
              <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-4 rounded ml-2" @click="deleteLengan(lengan.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal untuk Add Lengan -->
      <div v-if="lenganAdding" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Tambah Jenis Lengan Baru</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Lengan:</label>
              <input v-model="newLengan.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="newLengan.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="addLengan" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Tambah</button>
              <button @click="cancelAddLengan" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal untuk Edit Lengan -->
      <div v-if="lenganEditing" class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen px-4">
          <div class="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:max-w-lg">
            <div class="bg-gray-100 px-4 py-3">
              <h2 class="text-xl font-semibold">Edit Jenis Lengan</h2>
            </div>
            <div class="px-4 py-3">
              <label class="block text-sm font-medium text-gray-700">Jenis Lengan:</label>
              <input v-model="selectedLengan.type" type="text" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
              <label class="block text-sm font-medium text-gray-700 mt-4">Harga:</label>
              <input v-model="selectedLengan.harga" type="number" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
            </div>
            <div class="bg-gray-100 px-4 py-3 sm:flex sm:flex-row-reverse">
              <button @click="updateLengan" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0 sm:ml-2">Simpan</button>
              <button @click="cancelEditLengan" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2 sm:mt-0">Batal</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "@/firebase";
import NavbarViewAdmin from "@/components/NavbarViewAdmin.vue";

import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default {
  components: {
    NavbarViewAdmin,
  },
  data() {
    return {
      activeTable: "tinta",

      tintaList: [],
      tintaEditing: false,
      tintaAdding: false, // kontrol untuk modal tambah tinta
      selectedTinta: null, // data tinta yang sedang diedit
      newTinta: { type: "", harga: "" }, // data tinta baru untuk ditambahkan

      bahanList: [],
      bahanEditing: false,
      bahanAdding: false, // kontrol untuk modal tambah bahan
      selectedBahan: null, // data bahan yang sedang diedit
      newBahan: { type: "", harga: "" }, // data bahan baru untuk ditambahkan

      finishingList: [],
      finishingEditing: false,
      finishingAdding: false, // kontrol untuk modal tambah finishing
      selectedFinishing: null, // data finishing yang sedang diedit
      newFinishing: { type: "", harga: "" }, // data finishing baru untuk ditambahkan

      sizeList: [],
      sizeEditing: false,
      sizeAdding: false, // kontrol untuk modal tambah size
      selectedSize: null, // data size yang sedang diedit
      newSize: { type: "", harga: "" }, // data size baru untuk ditambahkan

      lenganList: [],
      lenganEditing: false,
      lenganAdding: false, // kontrol untuk modal tambah lengan
      selectedLengan: null, // data lengan yang sedang diedit
      newLengan: { type: "", harga: "" }, // data lengan baru untuk ditambahkan
    };
  },
  async mounted() {
    this.fetchTintaData();
    this.fetchBahanData();
    this.fetchFinishingData();
    this.fetchSizeData();
    this.fetchLenganData();
  },
  methods: {
    showTable(tableName) {
      this.activeTable = tableName;
    },

    async fetchTintaData() {
      try {
        const querySnapshot = await getDocs(collection(db, "tinta"));
        const tintaData = [];
        querySnapshot.forEach((doc) => {
          tintaData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.tintaList = tintaData;
      } catch (error) {
        console.error("Error fetching tinta data: ", error);
      }
    },

    async deleteTinta(id) {
      try {
        await deleteDoc(doc(db, "tinta", id));
        this.tintaList = this.tintaList.filter((tinta) => tinta.id !== id); // update UI setelah hapus
      } catch (error) {
        console.error("Error deleting tinta: ", error);
      }
    },

    editTinta(tinta) {
      this.tintaEditing = true;
      this.selectedTinta = { ...tinta }; // duplikat data agar tidak langsung memodifikasi array
    },

    async updateTinta() {
      try {
        const tintaRef = doc(db, "tinta", this.selectedTinta.id);
        await updateDoc(tintaRef, {
          type: this.selectedTinta.type,
          harga: this.selectedTinta.harga,
        });
        this.fetchTintaData(); // refresh data setelah update
        this.tintaEditing = false; // tutup form edit
        this.selectedTinta = null;
      } catch (error) {
        console.error("Error updating tinta: ", error);
      }
    },
    // Buka modal tambah tinta
    openAddModal() {
      this.tintaAdding = true;
      this.newTinta = { type: "", harga: "" };
    },
    // Tambah tinta baru ke Firestore
    async addTinta() {
      try {
        await addDoc(collection(db, "tinta"), {
          type: this.newTinta.type,
          harga: this.newTinta.harga,
        });
        this.fetchTintaData(); // refresh data setelah tambah
        this.tintaAdding = false; // tutup modal tambah
        this.newTinta = { type: "", harga: "" }; // reset form
      } catch (error) {
        console.error("Error adding tinta: ", error);
      }
    },
    // Tutup modal tambah tinta
    cancelAdd() {
      this.tintaAdding = false;
    },
    // Tutup modal edit tinta
    cancelEdit() {
      this.tintaEditing = false;
      this.selectedTinta = null;
    },

    // Metode buat Bahan
    async fetchBahanData() {
      try {
        const querySnapshot = await getDocs(collection(db, "bahan"));
        const bahanData = [];
        querySnapshot.forEach((doc) => {
          bahanData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.bahanList = bahanData;
      } catch (error) {
        console.error("Error fetching bahan data: ", error);
      }
    },

    async deleteBahan(id) {
      try {
        await deleteDoc(doc(db, "bahan", id));
        this.bahanList = this.bahanList.filter((bahan) => bahan.id !== id);
      } catch (error) {
        console.error("Error deleting bahan: ", error);
      }
    },

    editBahan(bahan) {
      this.bahanEditing = true;
      this.selectedBahan = { ...bahan };
    },

    async updateBahan() {
      try {
        const bahanRef = doc(db, "bahan", this.selectedBahan.id);
        await updateDoc(bahanRef, {
          type: this.selectedBahan.type,
          harga: this.selectedBahan.harga,
        });
        this.fetchBahanData();
        this.bahanEditing = false;
        this.selectedBahan = null;
      } catch (error) {
        console.error("Error updating bahan: ", error);
      }
    },

    openAddModalBahan() {
      this.bahanAdding = true;
      this.newBahan = { type: "", harga: "" };
    },

    async addBahan() {
      try {
        await addDoc(collection(db, "bahan"), {
          type: this.newBahan.type,
          harga: this.newBahan.harga,
        });
        this.fetchBahanData();
        this.bahanAdding = false;
        this.newBahan = { type: "", harga: "" };
      } catch (error) {
        console.error("Error adding bahan: ", error);
      }
    },

    cancelAddBahan() {
      this.bahanAdding = false;
    },

    cancelEditBahan() {
      this.bahanEditing = false;
      this.selectedBahan = null;
    },

    // Metode Buat Finishing
    async fetchFinishingData() {
      try {
        const querySnapshot = await getDocs(collection(db, "finishing"));
        const finishingData = [];
        querySnapshot.forEach((doc) => {
          finishingData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.finishingList = finishingData;
      } catch (error) {
        console.error("Error fetching finishing data: ", error);
      }
    },

    async deleteFinishing(id) {
      try {
        await deleteDoc(doc(db, "finishing", id));
        this.finishingList = this.finishingList.filter((finishing) => finishing.id !== id);
      } catch (error) {
        console.error("Error deleting finishing: ", error);
      }
    },

    editFinishing(finishing) {
      this.finishingEditing = true;
      this.selectedFinishing = { ...finishing };
    },

    async updateFinishing() {
      try {
        const finishingRef = doc(db, "finishing", this.selectedFinishing.id);
        await updateDoc(finishingRef, {
          type: this.selectedFinishing.type,
          harga: this.selectedFinishing.harga,
        });
        this.fetchFinishingData();
        this.finishingEditing = false;
        this.selectedFinishing = null;
      } catch (error) {
        console.error("Error updating finishing: ", error);
      }
    },

    openAddModalFinishing() {
      this.finishingAdding = true;
      this.newFinishing = { type: "", harga: "" };
    },

    async addFinishing() {
      try {
        await addDoc(collection(db, "finishing"), {
          type: this.newFinishing.type,
          harga: this.newFinishing.harga,
        });
        this.fetchFinishingData();
        this.finishingAdding = false;
        this.newFinishing = { type: "", harga: "" };
      } catch (error) {
        console.error("Error adding finishing: ", error);
      }
    },

    cancelAddFinishing() {
      this.finishingAdding = false;
    },

    cancelEditFinishing() {
      this.finishingEditing = false;
      this.selectedFinishing = null;
    },

    // Metode Buat Size
    async fetchSizeData() {
      try {
        const querySnapshot = await getDocs(collection(db, "ukuran"));
        const sizeData = [];
        querySnapshot.forEach((doc) => {
          sizeData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.sizeList = sizeData;
      } catch (error) {
        console.error("Error fetching size data: ", error);
      }
    },
    async deleteSize(id) {
      try {
        await deleteDoc(doc(db, "ukuran", id));
        this.sizeList = this.sizeList.filter((size) => size.id !== id);
      } catch (error) {
        console.error("Error deleting size: ", error);
      }
    },
    editSize(size) {
      this.sizeEditing = true;
      this.selectedSize = { ...size };
    },
    async updateSize() {
      try {
        const sizeRef = doc(db, "ukuran", this.selectedSize.id);
        await updateDoc(sizeRef, {
          type: this.selectedSize.type,
          harga: this.selectedSize.harga,
        });
        this.fetchSizeData();
        this.sizeEditing = false;
        this.selectedSize = null;
      } catch (error) {
        console.error("Error updating size: ", error);
      }
    },

    openAddModalSize() {
      this.sizeAdding = true;
      this.newSize = { type: "", harga: "" };
    },

    async addSize() {
      try {
        await addDoc(collection(db, "ukuran"), {
          type: this.newSize.type,
          harga: this.newSize.harga,
        });
        this.fetchSizeData();
        this.sizeAdding = false;
        this.newSize = { type: "", harga: "" };
      } catch (error) {
        console.error("Error adding size: ", error);
      }
    },

    cancelAddSize() {
      this.sizeAdding = false;
    },

    cancelEditSize() {
      this.sizeEditing = false;
      this.selectedSize = null;
    },

    // Metode Buat Lengan
    async fetchLenganData() {
      try {
        const querySnapshot = await getDocs(collection(db, "lengan"));
        const lenganData = [];
        querySnapshot.forEach((doc) => {
          lenganData.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        this.lenganList = lenganData;
      } catch (error) {
        console.error("Error fetching lengan data: ", error);
      }
    },
    async deleteLengan(id) {
      try {
        await deleteDoc(doc(db, "lengan", id));
        this.lenganList = this.lenganList.filter((lengan) => lengan.id !== id);
      } catch (error) {
        console.error("Error deleting lengan: ", error);
      }
    },
    editLengan(lengan) {
      this.lenganEditing = true;
      this.selectedLengan = { ...lengan };
    },
    async updateLengan() {
      try {
        const lenganRef = doc(db, "lengan", this.selectedLengan.id);
        await updateDoc(lenganRef, {
          type: this.selectedLengan.type,
          harga: this.selectedLengan.harga,
        });
        this.fetchLenganData();
        this.lenganEditing = false;
        this.selectedLengan = null;
      } catch (error) {
        console.error("Error updating lengan: ", error);
      }
    },

    openAddModalLengan() {
      this.lenganAdding = true;
      this.newLengan = { type: "", harga: "" };
    },

    async addLengan() {
      try {
        await addDoc(collection(db, "lengan"), {
          type: this.newLengan.type,
          harga: this.newLengan.harga,
        });
        this.fetchLenganData();
        this.lenganAdding = false;
        this.newLengan = { type: "", harga: "" };
      } catch (error) {
        console.error("Error adding lengan: ", error);
      }
    },

    cancelAddLengan() {
      this.lenganAdding = false;
    },

    cancelEditLengan() {
      this.lenganEditing = false;
      this.selectedLengan = null;
    },
  },
};
</script>

<style scoped>
nav ul li img {
  width: 50px;
  height: 50px;
}

nav ul li a {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 0.5rem;
}
</style>
