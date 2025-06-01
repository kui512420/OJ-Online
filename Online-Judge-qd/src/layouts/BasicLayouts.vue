<template>
  <div class="Wapper">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GolbalHeader></GolbalHeader>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer"
        ><a href="https://kuikui.space" target="_blank">猿分享 by 魁魁</a></a-layout-footer
      >
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GolbalHeader from '@/components/GolbalHeader.vue'
</script>
<style scoped>
.header {
  position: sticky;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.3s ease;
}

.Wapper {
  width: 100%;
  overflow-x: hidden;
}

.Wapper .content {
  padding: 20px;
}

.Wapper .footer {
  padding: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  background-color: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  transition: background-color 0.3s ease;
}
</style>
