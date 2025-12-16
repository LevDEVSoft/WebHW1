<template>
  <div class="auth-container">
    <h2>Login</h2>

    <form @submit.prevent="handleLogin">
      <input
        type="email"
        v-model="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">Login</button>
    </form>

    <p class="or">or</p>

    <button class="secondary" @click="goToSignup">
      Signup
    </button>
  </div>
</template>

<script>
export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";

      if (!this.email || !this.password) {
        this.error = "Email and password are required";
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        const data = await res.json();

        if (!res.ok) {
          this.error = data.message || "Login failed";
          return;
        }

        localStorage.setItem("token", data.token);
        this.$router.push("/");
      } catch (err) {
        this.error = "Server not reachable";
      }
    },
    goToSignup() {
      this.$router.push("/signup");
    }
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 320px;
  margin: 60px auto;
  padding: 20px;
  background: #e6f0c2;
  border-radius: 8px;
  text-align: center;
}

input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
}

button {
  width: 100%;
  padding: 8px;
  cursor: pointer;
}

.secondary {
  margin-top: 10px;
}

.error {
  color: red;
  font-size: 0.9em;
}

.or {
  margin: 10px 0;
}
</style>
