<template>
  <div v-if="open" class="overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="head">
        <div class="t">Save / Load</div>
        <button @click="$emit('close')">Close (Esc)</button>
      </div>

      <div class="grid">
        <div v-for="s in slots" :key="s.slot" class="card">
          <div class="top">
            <div class="slot">Slot {{ s.slot }}</div>
            <div class="time" v-if="s.savedAt">{{ fmt(s.savedAt) }}</div>
            <div class="time" v-else>Empty</div>
          </div>
          <div class="title">{{ s.title || "—" }}</div>
          <div class="actions">
            <button @click="$emit('save', s.slot)">Save</button>
            <button :disabled="!s.payload" @click="$emit('load', s.slot)">Load</button>
            <button :disabled="!s.payload" @click="$emit('delete', s.slot)">Delete</button>
          </div>
        </div>
      </div>

      <div class="note">
        Saved locally in your browser (localStorage). Works great on Mac Safari/Chrome.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { open: Boolean, slots: { type: Array, default: () => [] } },
  methods: {
    fmt(iso) {
      try { return new Date(iso).toLocaleString(); } catch { return iso; }
    }
  }
};
</script>

<style scoped>
.overlay{
  position:absolute; inset:0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(8px);
  display:grid; place-items:center;
  padding: 12px;
}
.modal{
  width: min(860px, 96vw);
  background: rgba(12,16,32,0.86);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  box-shadow: var(--shadow);
}
.head{
  display:flex; justify-content:space-between; align-items:center;
  padding: 12px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
}
.t{ font-weight: 800; }
.grid{
  padding: 12px;
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.card{
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  padding: 10px;
}
.top{ display:flex; justify-content:space-between; align-items:center; }
.slot{ font-weight: 750; }
.time{ color: rgba(255,255,255,0.60); font-size: 12px; }
.title{ margin-top: 8px; color: rgba(255,255,255,0.85); min-height: 38px; }
.actions{ margin-top: 10px; display:flex; gap: 10px; flex-wrap:wrap; }
.note{ padding: 0 12px 12px 12px; color: rgba(255,255,255,0.55); font-size: 12px; }
@media (max-width: 900px){
  .grid{ grid-template-columns: 1fr; }
}
</style>
