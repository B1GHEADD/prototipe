<template>
  <div class="flex justify-center items-center h-screen px-4">
    <!-- Container -->
    <div class="flex flex-col md:flex-row items-center md:items-stretch h-auto md:h-2/4 w-full max-w-3xl border border-black rounded-lg overflow-hidden shadow-md">
      <!-- Logo -->
      <div class="h-32 md:h-full w-full md:w-1/2 bg-gray-100 flex justify-center items-center">
        <img class="h-24 md:h-full object-contain" src="/src/assets/img/logo.png" alt="Logo" />
      </div>

      <!-- Form -->
      <div class="w-full md:w-1/2 p-6">
        <h1 class="text-left text-2xl font-bold mb-4">Sign In</h1>
        <form class="space-y-4" @submit.prevent="login">
          <!-- Email Field -->
          <div class="flex flex-col">
            <label>Email</label>
            <input type="email" v-model="login_form.email" placeholder="Masukkan Email" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- Password Field -->
          <div class="flex flex-col">
            <label>Password</label>
            <input type="password" v-model="login_form.password" placeholder="Masukkan Password" class="border border-gray-300 p-2 mt-2 rounded-md" />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center mt-4">
            <button type="submit" class="bg-[#ffcc00] p-2 font-bold text-white rounded-md w-full">Submit</button>
          </div>

          <!-- Additional Links -->
          <div class="text-center mt-4 text-sm">
            <p>
              Not a member?
              <a class="text-[#ffcc00] font-bold underline" href="/register">Sign Up</a>
            </p>
            <a class="text-[#ffcc00] font-bold underline cursor-pointer" @click="forgotPassword"> Forgot Password? </a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { auth } from "../firebase/index";
import { sendPasswordResetEmail } from "firebase/auth";

export default {
  setup() {
    const login_form = ref({});
    const store = useStore();

    const login = () => {
      store.dispatch("login", login_form.value);
    };

    const forgotPassword = async () => {
      const email = login_form.value.email;
      if (!email) {
        alert("Please enter your email address.");
        return;
      }

      try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent! Check your inbox.");
      } catch (error) {
        console.error("Error sending password reset email:", error);
        alert("An error occurred while sending the reset email. " + error.message);
      }
    };

    return {
      login_form,
      login,
      forgotPassword,
    };
  },
};
</script>
