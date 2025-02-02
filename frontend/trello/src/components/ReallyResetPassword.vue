<template>
  <div class="reset-password">
    <h2>Redefinir Senha</h2>
    <form @submit.prevent="resetPassword">
      <div>
        <label for="code">Código de Verificação:</label>
        <input type="text" v-model="code" required placeholder="Digite o código recebido" />
      </div>
      <div>
        <label for="new-password">Nova Senha:</label>
        <input type="password" v-model="newPassword" required placeholder="Digite sua nova senha" />
      </div>
      <div>
        <label for="confirm-password">Confirme a Nova Senha:</label>
        <input type="password" v-model="confirmPassword" required placeholder="Confirme a nova senha" />
      </div>
      <button type="submit">Alterar Senha</button>
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
    const code = ref("");
    const newPassword = ref("");
    const confirmPassword = ref("");
    const message = ref("");
    const router = useRouter();

    function resetPassword() {
      if (!code.value) {
        message.value = "Por favor, insira o código de verificação.";
        return;
      }
      if (newPassword.value.length < 6) {
        message.value = "A senha deve ter pelo menos 6 caracteres.";
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        message.value = "As senhas não coincidem.";
        return;
      }



      message.value = "Senha alterada com sucesso!";

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }

    return { code, newPassword, confirmPassword, message, resetPassword };
  }
};
</script>

<style scoped>
.reset-password {
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
