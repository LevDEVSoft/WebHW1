<template>
  <div class="signup-page">
    <div class="signup-container">
      <h2>Sign Up</h2>
      
      <form @submit.prevent="handleSubmit">
        <!-- Email поле -->
        <div class="form-group">
        <label for="email">Email</label>
        <input
            id="email"
            v-model="email"
            type="text"
            placeholder="Enter your email"
        />
</div>

        <!-- Password поле -->
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
          />
        </div>

        <!-- Ошибки валидации -->
        <div v-if="tried && errors.length > 0" class="error-box">
          <p class="error-title">Password is not valid:</p>
          <ul>
            <li v-for="error in errors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <!-- Кнопка -->
        <button type="submit" class="signup-btn">
          Sign Up
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignupPage',
  data() {
    return {
      email: '',
      password: '',
      tried: false, // Флаг: пытался ли пользователь отправить форму
    };
  },
  computed: {
  errors() {
    const p = this.password;
    const err = [];

    // Если пользователь ещё не пытался отправить форму, не показываем ошибки
    if (!this.tried) {
      return [];
    }

    // Если пароль пустой, не показываем детальные ошибки
    if (p.length === 0) {
      return [];
    }

    // Проверка длины (8-15 символов)
    if (p.length < 8 || p.length > 15) {
      err.push('Length must be 8–15 characters');
    }

    // Должен начинаться с заглавной буквы
    if (!/^[A-Z]/.test(p)) {
      err.push('Must start with uppercase letter');
    }

    // Минимум одна заглавная буква
    if (!/[A-Z]/.test(p)) {
      err.push('Must contain at least one uppercase letter');
    }

    // Минимум две строчные буквы
    if ((p.match(/[a-z]/g) || []).length < 2) {
      err.push('Must contain at least two lowercase letters');
    }

    // Минимум одна цифра
    if (!/\d/.test(p)) {
      err.push('Must contain a number');
    }

    // Должен содержать "_"
    if (!/_/.test(p)) {
      err.push("Must contain '_'");
    }

    return err;
  },
},
  methods: {
  handleSubmit() {
    // Отмечаем, что пользователь попытался отправить форму
    this.tried = true;

    // Проверка email
    if (!this.email || !this.email.trim()) {
      alert('Please enter an email');
      return;
    }

    if (!this.email.includes('@') || !this.email.includes('.')) {
      alert('Please enter a valid email (e.g., user@example.com)');
      return;
    }

    // Проверка пароля
    if (this.password.length === 0) {
      return; // Просто показываем ошибки валидации
    }

    // Если ошибок нет — успех
    if (this.errors.length === 0) {
      alert('Success! Registration complete.');
      // Сбрасываем форму
      this.email = '';
      this.password = '';
      this.tried = false;
    }
  },

  async handleSubmit() {
    this.tried = true;
    if (this.errors.length > 0) return;
    
    try {
      const res = await fetch('http://localhost:3000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        this.$router.push('/');
      } else {
        alert(data.error);
      }
    } catch {
      alert('Signup failed');
    }
  },
  
},
};
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f4f8;
  padding: 20px;
}

.signup-container {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
}

.signup-container h2 {
  margin-bottom: 24px;
  text-align: center;
  color: #111827;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 15px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #1976d2;
}

.error-box {
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 20px;
}

.error-title {
  font-weight: 600;
  color: #b91c1c;
  margin-bottom: 8px;
}

.error-box ul {
  margin: 0;
  padding-left: 20px;
}

.error-box li {
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 4px;
}

.signup-btn {
  width: 100%;
  padding: 12px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.signup-btn:hover {
  background: #145aa3;
}

.signup-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>