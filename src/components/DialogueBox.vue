<template>
  <div class="box" @click.stop="onClick">
    <div class="header">
      <div class="speaker">{{ speaker }}</div>
      <div class="title" v-if="title">{{ title }}</div>
    </div>

    <TypewriterText
      :text="text"
      :speedMs="textSpeed"
      :skip="skipTyping"
      @typing="$emit('typing', $event)"
      @done="onDone"
    />

    <div class="footer">
      <div class="meta">
        <span v-if="autoAdvance" class="pill">AUTO</span>
        <span v-if="skipTyping" class="pill">SKIP</span>
      </div>
      <div class="next">
        <span class="arrow">▸</span>
        <span class="muted">click / Space</span>
      </div>
    </div>
  </div>
</template>

<script>
import TypewriterText from "./TypewriterText.vue";

export default {
  components: { TypewriterText },
  props: {
    speaker: { type: String, default: "System" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    textSpeed: { type: Number, default: 22 },
    skipTyping: { type: Boolean, default: false },
    autoAdvance: { type: Boolean, default: false },
    autoDelayMs: { type: Number, default: 700 }
  },
  data() {
    return { canAdvance: false, timer: null };
  },
  methods: {
    onDone() {
      this.canAdvance = true;
      this.$emit("done");
      if (this.autoAdvance) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.$emit("requestNext");
        }, this.autoDelayMs);
      }
    },
    onClick() {
      // if typing, TypewriterText handles skip itself; here we only request next when already done
      if (this.canAdvance) this.$emit("requestNext");
    }
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  }
};
</script>

<style scoped>
.box{
  flex:1;
  min-height: 240px;
  max-width: 980px;
  background: var(--panel);
  border: 1px solid rgba(255,255,255,0.10);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  padding: 14px 16px 10px 16px;
  position:relative;
}
.header{
  display:flex;
  align-items: baseline;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.speaker{
  font-weight: 720;
  letter-spacing: 0.2px;
}
.title{
  color: rgba(255,255,255,0.72);
  font-size: 13px;
}
.footer{
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-top: 1px solid rgba(255,255,255,0.08);
  padding-top: 10px;
  margin-top: 12px;
}
.meta{ display:flex; gap: 8px; }
.pill{
  font-size: 11px;
  color: rgba(255,255,255,0.75);
  border: 1px solid rgba(255,255,255,0.14);
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
}
.next{ display:flex; align-items:center; gap: 6px; color: rgba(255,255,255,0.70); }
.arrow{ color: rgba(130,190,255,0.9); }
.muted{ color: rgba(255,255,255,0.55); font-size: 12px; }
</style>
