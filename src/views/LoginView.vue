<template>
  <div class="flex justify-center items-center h-screen">
    <div class="flex h-2/4">
      <img class="h-full" src="/src/assets/img/logo.png" alt="" />
      <div class="h-full border border-black rounded-r-lg">
        <div>
          <h1 class="text-left p-3 text-3xl font-bold">Sign In</h1>
          <form class="flex-row px-3" @submit.prevent="login">
            <div class="flex flex-col">
              <label>Email</label>
              <input type="email" v-model="login_form.email" placeholder="Masukan Username" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex flex-col">
              <label class="mt-2">Password</label>
              <input type="password" v-model="login_form.password" placeholder="Masukan Password" class="border border-gray-300 p-2 mt-2 rounded-md" />
            </div>
            <div class="flex justify-center mt-4">
              <button type="submit" value="Login" class="bg-[#ffcc00] p-2 font-bold text-white rounded-md w-full">Submit</button>
            </div>
            <div class="text-center mt-2 text-sm">
              <h1 class="">Not a member?</h1>
              <a class="text-[#ffcc00] font-bold underline" href="/register">Sign Up</a>
            </div>
            <div class="text-center mt-2 text-sm">
              <a class="text-[#ffcc00] font-bold underline cursor-pointer" @click="forgotPassword">Forgot Password?</a>
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
