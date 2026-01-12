<template>
  <div class="choices" @click.stop>
    <button
      v-for="(c, idx) in choices"
      :key="idx"
      class="choice"
      @click="$emit('choose', idx)"
    >
      <span class="idx">{{ idx + 1 }}</span>
      <span class="label">{{ c.label }}</span>
      <span class="chev">›</span>
    </button>
  </div>
</template>

<script>
export default {
  props: { choices: { type: Array, default: () => [] } }
};
</script>

<style scoped>
.choices{
  width: 360px;
  max-width: 38vw;
  display:flex;
  flex-direction:column;
  gap: 10px;
  margin-bottom: 10px;
}
.choice{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  text-align:left;
  padding: 12px 12px;
  border-radius: var(--radius2);
  background: var(--panel2);
}
.idx{
  width: 22px; height: 22px;
  display:grid; place-items:center;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  flex: 0 0 auto;
}
.label{
  flex: 1 1 auto;
  color: rgba(255,255,255,0.9);
}
.chev{
  color: rgba(130,190,255,0.85);
  font-size: 18px;
}
@media (max-width: 900px){
  .choices{ width: 100%; max-width: 100%; }
}
</style>
