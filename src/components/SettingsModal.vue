<template>
  <div v-if="open" class="overlay" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="head">
        <div class="t">Settings</div>
        <button @click="$emit('close')">Close (Esc)</button>
      </div>

      <div class="body">
        <div class="row">
          <div class="label">Text speed</div>
          <input type="range" min="8" max="60" :value="settings.textSpeed" @input="set('textSpeed',$event.target.value)" />
          <div class="val">{{ settings.textSpeed }} ms/char</div>
        </div>

        <div class="row">
          <div class="label">Auto delay</div>
          <input type="range" min="200" max="1600" step="50" :value="settings.autoDelayMs" @input="set('autoDelayMs',$event.target.value)" />
          <div class="val">{{ settings.autoDelayMs }} ms</div>
        </div>

        <div class="row toggles">
          <button @click="set('isAuto', !settings.isAuto)" :class="{active:settings.isAuto}">Auto</button>
          <button @click="set('isSkip', !settings.isSkip)" :class="{active:settings.isSkip}">Skip</button>
          <button @click="set('sfx', !settings.sfx)" :class="{active:settings.sfx}">SFX (optional)</button>
        </div>

        <div class="note">
          Tip: Auto and Skip are mutually exclusive in the shell logic.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { open: Boolean, settings: { type: Object, required: true } },
  methods: {
    set(k, v) {
      const numKeys = new Set(["textSpeed", "autoDelayMs"]);
      const patch = { [k]: numKeys.has(k) ? Number(v) : v };
      this.$emit("update", patch);
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
  width: min(560px, 94vw);
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
.body{ padding: 12px; }
.row{
  display:grid;
  grid-template-columns: 120px 1fr 120px;
  gap: 10px;
  align-items:center;
  margin-bottom: 14px;
}
.toggles{
  grid-template-columns: 1fr 1fr 1fr;
}
.label{ color: rgba(255,255,255,0.8); font-size: 13px; }
.val{ color: rgba(255,255,255,0.65); font-size: 12px; text-align:right; }
input[type="range"]{ width:100%; }
button.active{
  border-color: rgba(130,190,255,0.42);
  background: rgba(130,190,255,0.10);
}
.note{ color: rgba(255,255,255,0.55); font-size: 12px; margin-top: 6px; }
</style>
