<template>
  <div class="register-container">
    <h2>Cadastro</h2>

    <form @submit.prevent="registerUser">
      <div class="input-group">
        <label for="name">Nome:</label>
        <input type="text" id="name" v-model="user.name" required />
      </div>

      <div class="input-group">
        <label for="email">E-mail:</label>
        <input type="email" id="email" v-model="user.email" required />
      </div>

      <div class="input-group">
        <label for="password">Senha:</label>
        <input type="password" id="password" v-model="user.password" required />
      </div>

      <div class="input-group">
        <label for="confirmpassword">Confirmar Senha:</label>
        <input type="password" id="confirmpassword" v-model="user.confirmpassword" required />
      </div>

      <button type="submit" :disabled="loading">Cadastrar</button>
    </form>

    <p v-if="message" :class="{'error': isError, 'success': !isError}">{{ message }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const user = ref({
  name: "",
  email: "",
  password: "",
  confirmpassword: ""
});
const router = useRouter();
const message = ref("");
const isError = ref(false);
const loading = ref(false);

async function registerUser() {
  message.value = "";
  isError.value = false;
  loading.value = true;


  try {
    const response = await fetch("http://localhost:3000/user/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user.value)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.msg || "Erro ao cadastrar usuário.");
    }

    message.value = data.msg;
    isError.value = false;

    // Resetando os campos após o cadastro
    user.value = { name: "", email: "", password: "", confirmpassword: "" };

  } catch (error) {
    message.value = error.message;
    isError.value = true;
  } finally {
    loading.value = false;
    setTimeout(() => {
      message.value = "Redirecionando para a página de login."
      router.push("/login");
    }, 2000);
  }
}
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background: #aaa;
  cursor: not-allowed;
}

p {
  text-align: center;
  margin-top: 15px;
}

.success {
  color: green;
}

.error {
  color: red;
}
</style>
