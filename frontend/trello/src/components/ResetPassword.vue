<template>
  <div class="forgot-password">
    <h2>Esqueci Minha Senha</h2>
    <form @submit.prevent="sendResetCode">
      <div>
        <label for="email">Digite seu e-mail:</label>
        <input type="email" v-model="email" required placeholder="seuemail@email.com" />
      </div>
      <button type="submit">Enviar Código</button>
    </form>

    <p v-if="message" class="message">{{ message }}</p>

    <router-link to="/login">Voltar para o Login</router-link>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const message = ref("");
    const router = useRouter();

    function sendResetCode() {
      if (!email.value.includes("@")) {
        message.value = "Por favor, insira um e-mail válido!";
        return;
      }

      message.value = "Enviamos um código para seu e-mail!";

      setTimeout(() => {
        router.push("/reset-password");
      }, 5000);
    }

    return { email, message, sendResetCode };
  }
};
</script>

<style scoped>
.forgot-password {
  max-width: 400px;
  margin: auto;
  text-align: center;
}

input {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
}

button {
  margin-top: 10px;
}

.message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}
</style>
