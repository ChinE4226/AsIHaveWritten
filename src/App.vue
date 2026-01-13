<template>
  <main class="stage">
    <AsIveWritten />
  </main>
</template>

<script setup>
import AsIveWritten from "./components/AsIveWritten.vue";
</script>

<style scoped>
.stage{
  height:100vh;
  width:100vw;
  display:flex;
  align-items:center;
  justify-content:center;
  padding: 24px;
}
</style>
