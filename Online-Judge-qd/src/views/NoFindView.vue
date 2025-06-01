<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-title">404</h1>
      <p class="error-message">未找到该页面~</p>
      <a href="/" class="error-home-link">返回首页</a>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f9;
}

.error-content {
  text-align: center;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-title {
  font-size: 80px;
  color: #333;
  margin-bottom: 20px;
}

.error-message {
  font-size: 24px;
  color: #666;
  margin-bottom: 30px;
}

.error-home-link {
  display: inline-block;
  padding: 12px 24px;
  background-color: #007bff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.error-home-link:hover {
  background-color: #0056b3;
}
</style>    
