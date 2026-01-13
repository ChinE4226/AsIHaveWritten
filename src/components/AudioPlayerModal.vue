<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Audio Player" @click.self="close">
    <div class="panel">
      <header class="head">
        <div>
          <div class="name">{{ title }}</div>
          <div class="hint">If the audio fails to load, add your own file into <b>public/</b>.</div>
        </div>
        <button class="btn danger" @click="close">Close</button>
      </header>

      <div class="body">
        <audio class="audio" :src="src" controls autoplay />
        <div class="note">
          Default source: <code>{{ src }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  src: { type: String, required: true }
});
const emit = defineEmits(["close"]);
function close(){ emit("close"); }
</script>

<style scoped>
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display:grid;
  place-items:center;
  padding: 18px;
  z-index: 60;
}
.panel{
  width: min(720px, 96vw);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(18,28,52,0.92), rgba(10,16,32,0.92));
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(220,235,255,0.12);
  overflow:hidden;
}
.head{
  padding: 14px;
  border-bottom: 1px solid rgba(220,235,255,0.10);
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 12px;
}
.name{ font-weight: 700; }
.hint{
  margin-top: 4px;
  font-size: 12px;
  color: rgba(245,250,255,0.65);
}
.body{
  padding: 14px;
}
.audio{
  width: 100%;
}
.note{
  margin-top: 10px;
  font-size: 12px;
  color: rgba(245,250,255,0.65);
}
.btn{
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(120,160,255,0.10);
  box-shadow: inset 0 0 0 1px rgba(220,235,255,0.10);
}
.danger:hover{
  background: rgba(255,120,120,0.18);
}
code{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
</style>
