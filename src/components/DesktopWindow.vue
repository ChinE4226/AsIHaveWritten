<template>
  <section
    class="window"
    ref="root"
    :style="styleVars"
    aria-label="Window"
  >
    <header class="topbar" ref="dragHandle" aria-label="Top Bar">
      <div class="title">
        <div class="sigil" aria-hidden="true">
          <!-- simple emblem -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2l8 4v6c0 6-4 9-8 10-4-1-8-4-8-10V6l8-4z" stroke="rgba(200,230,255,0.9)" stroke-width="1.5"/>
            <path d="M8.2 10.2h7.6M9.6 13h4.8" stroke="rgba(200,230,255,0.7)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="text">
          <div class="main">{{ title }}</div>
          <div class="sub">{{ subtitle }}</div>
        </div>
      </div>

      <div class="actions">
        <button class="close" @click="$emit('requestClose')" aria-label="Close">
          ✕
        </button>
      </div>
    </header>

    <div class="frame">
      <div class="inner">
        <slot />
      </div>
    </div>

    <footer class="footer">
      <div class="left">
        <div class="badge" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="rgba(210,235,255,0.7)" stroke-width="1.5"/>
            <path d="M8.5 14.5c1.4 1.6 5.6 1.6 7 0M9 10h.01M15 10h.01" stroke="rgba(210,235,255,0.7)" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="label">{{ footerLeftLabel }}</div>
      </div>

      <div class="right">
        <div class="primary">{{ footerRightPrimary }}</div>
        <div class="secondary">{{ footerRightSecondary }}</div>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useDraggable } from "./composables/useDraggable.js";

defineEmits(["requestClose"]);

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  footerLeftLabel: { type: String, default: "" },
  footerRightPrimary: { type: String, default: "" },
  footerRightSecondary: { type: String, default: "" }
});

const root = ref(null);
const dragHandle = ref(null);

const { x, y, initCentered } = useDraggable(root, dragHandle);

onMounted(() => {
  initCentered({ width: 980, height: 520, clampPadding: 18 });
});

const styleVars = computed(() => ({
  transform: `translate3d(${x.value}px, ${y.value}px, 0)`
}));
</script>

<style scoped>
.window{
  width: min(980px, calc(100vw - 48px));
  height: min(520px, calc(100vh - 48px));
  position: absolute;
  border-radius: 14px;
  background: linear-gradient(180deg, var(--glass), rgba(10, 20, 45, 0.35));
  box-shadow:
    0 18px 60px var(--shadow),
    inset 0 0 0 1px var(--line);
  backdrop-filter: blur(10px);
  overflow:hidden;
}

.topbar{
  height: 58px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 10px 12px 10px 14px;
  border-bottom: 1px solid var(--line2);
  background: linear-gradient(180deg, rgba(25,45,85,0.35), rgba(15,25,45,0.10));
  user-select:none;
  cursor: grab;
}
.topbar:active{ cursor: grabbing; }

.title{
  display:flex;
  align-items:center;
  gap: 10px;
}
.sigil{
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display:grid;
  place-items:center;
  background: rgba(20,40,75,0.35);
  box-shadow: inset 0 0 0 1px rgba(220,235,255,0.10);
}
.text .main{
  font-weight: 650;
  letter-spacing: 0.2px;
}
.text .sub{
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
}

.actions{
  display:flex;
  align-items:center;
  gap: 10px;
}
.close{
  width: 38px;
  height: 34px;
  border-radius: 10px;
  background: rgba(35,55,90,0.25);
  box-shadow: inset 0 0 0 1px rgba(220,235,255,0.10);
  transition: transform 0.12s ease, background 0.12s ease;
}
.close:hover{
  background: rgba(255,120,120,0.18);
  transform: translateY(-1px);
}
.close:active{
  transform: translateY(0);
}

.frame{
  padding: 12px;
  height: calc(100% - 58px - 58px);
}
.inner{
  height: 100%;
  border-radius: 12px;
  background:
    radial-gradient(600px 260px at 50% 35%, rgba(120,160,255,0.16), transparent 60%),
    linear-gradient(180deg, rgba(10,20,40,0.55), rgba(10,20,40,0.18));
  box-shadow:
    inset 0 0 0 1px rgba(220,235,255,0.12);
  overflow:hidden;
  position:relative;
}

/* faint “horizon silhouettes” feel */
.inner::after{
  content:"";
  position:absolute;
  inset:auto 0 0 0;
  height: 38%;
  background:
    radial-gradient(200px 140px at 18% 90%, rgba(0,0,0,0.35), transparent 60%),
    radial-gradient(260px 160px at 50% 95%, rgba(0,0,0,0.35), transparent 60%),
    radial-gradient(240px 150px at 82% 92%, rgba(0,0,0,0.35), transparent 60%);
  opacity: 0.5;
  pointer-events:none;
}

.footer{
  height: 58px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 10px 14px;
  border-top: 1px solid var(--line2);
  background: linear-gradient(180deg, rgba(12,18,34,0.15), rgba(12,18,34,0.30));
}

.left{
  display:flex;
  align-items:center;
  gap: 10px;
  min-width: 240px;
}
.badge{
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display:grid;
  place-items:center;
  background: rgba(20,40,75,0.30);
  box-shadow: inset 0 0 0 1px rgba(220,235,255,0.10);
}
.label{
  font-size: 13px;
  color: var(--muted);
  letter-spacing: 0.2px;
}

.right{
  display:flex;
  align-items:flex-end;
  gap: 14px;
  color: var(--muted);
}
.primary{
  font-size: 13px;
}
.secondary{
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  color: rgba(245,250,255,0.75);
}
</style>
