<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="File Viewer" @click.self="close">
    <div class="panel">
      <header class="head">
        <div class="meta">
          <div class="name">{{ title }}</div>
          <div class="type">Type: {{ type.toUpperCase() }}</div>
        </div>
        <div class="actions">
          <button class="btn" @click="copy">Copy</button>
          <button class="btn" @click="download">Download</button>
          <button class="btn danger" @click="close">Close</button>
        </div>
      </header>

      <pre class="body"><code>{{ content }}</code></pre>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  type: { type: String, default: "exe" },
  content: { type: String, default: "" }
});

const emit = defineEmits(["close"]);

function close() {
  emit("close");
}

async function copy() {
  try {
    await navigator.clipboard.writeText(props.content);
  } catch {
    // Clipboard may be blocked in some contexts; fail silently for stability.
  }
}

function download() {
  const blob = new Blob([props.content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.title.replace(/[^\w\-]+/g, "_")}.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display:grid;
  place-items:center;
  padding: 18px;
  z-index: 50;
}

.panel{
  width: min(860px, 96vw);
  height: min(480px, 86vh);
  border-radius: 14px;
  background: linear-gradient(180deg, rgba(18,28,52,0.92), rgba(10,16,32,0.92));
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(220,235,255,0.12);
  overflow:hidden;
  display:flex;
  flex-direction:column;
}

.head{
  padding: 14px 14px 10px 14px;
  border-bottom: 1px solid rgba(220,235,255,0.10);
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 12px;
}

.name{
  font-weight: 700;
  letter-spacing: 0.2px;
}
.type{
  margin-top: 4px;
  font-size: 12px;
  color: rgba(245,250,255,0.65);
}

.actions{
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
  justify-content:flex-end;
}

.btn{
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(120,160,255,0.10);
  box-shadow: inset 0 0 0 1px rgba(220,235,255,0.10);
}
.btn:hover{
  background: rgba(120,160,255,0.16);
}
.danger:hover{
  background: rgba(255,120,120,0.18);
}

.body{
  margin:0;
  padding: 14px;
  overflow:auto;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(245,250,255,0.88);
}
code{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace; }
</style>
