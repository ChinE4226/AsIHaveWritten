<template>
  <div v-if="open" class="overlay" @click="$emit('close')">
    <div class="drawer" @click.stop>
      <div class="head">
        <div class="t">History</div>
        <div class="actions">
          <button @click="$emit('clear')">Clear</button>
          <button @click="$emit('close')">Close (Esc)</button>
        </div>
      </div>

      <div class="list">
        <div v-for="it in items" :key="it.id" class="item">
          <div class="who">
            <span class="speaker">{{ it.speaker }}</span>
            <span class="title" v-if="it.title">• {{ it.title }}</span>
          </div>
          <div class="txt">{{ it.text }}</div>
          <div class="row">
            <div class="time">{{ format(it.at) }}</div>
            <button @click="$emit('jump', it.nodeId)">Jump</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { open: Boolean, items: { type: Array, default: () => [] } },
  methods: {
    format(iso) {
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
  display:flex;
  justify-content:flex-end;
}
.drawer{
  width: min(520px, 92vw);
  height: 100%;
  background: rgba(12,16,32,0.86);
  border-left: 1px solid rgba(255,255,255,0.10);
  box-shadow: var(--shadow);
  display:flex;
  flex-direction:column;
}
.head{
  padding: 12px 12px;
  border-bottom: 1px solid rgba(255,255,255,0.10);
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.t{ font-weight: 700; }
.actions{ display:flex; gap: 10px; }
.list{
  padding: 12px;
  overflow:auto;
}
.item{
  border: 1px solid rgba(255,255,255,0.10);
  background: rgba(255,255,255,0.05);
  border-radius: 14px;
  padding: 10px 10px;
  margin-bottom: 10px;
}
.who{ color: rgba(255,255,255,0.85); font-size: 13px; }
.speaker{ font-weight: 700; }
.title{ color: rgba(255,255,255,0.62); }
.txt{ margin-top: 6px; color: rgba(255,255,255,0.86); line-height:1.45; white-space: pre-wrap; }
.row{ margin-top: 8px; display:flex; justify-content:space-between; align-items:center; gap: 10px; }
.time{ color: rgba(255,255,255,0.55); font-size: 12px; }
</style>
