<template>
  <div class="bar">
    <div class="left">
      <div class="brand">
        <div class="dot" />
        <div class="txt">
          <div class="title">Dialogue Shell</div>
          <div class="sub">HSR-inspired UI • your content</div>
        </div>
      </div>
    </div>

    <div class="right">
      <button @click="$emit('toggleAuto')" :class="{active:isAuto}">Auto (A)</button>
      <button @click="$emit('toggleSkip')" :class="{active:isSkip}">Skip (K)</button>
      <button @click="$emit('openHistory')">History (H)</button>
      <button @click="$emit('openSaveLoad')">Save/Load (S)</button>
      <button @click="$emit('openSettings')">Settings</button>
      <button @click="$emit('restart')">Restart</button>
    </div>
  </div>
</template>

<script>
export default {
  props: { isAuto: Boolean, isSkip: Boolean }
};
</script>

<style scoped>
.bar{
  position:absolute; top:0; left:0; right:0;
  height: 56px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 10px 14px;
  background: linear-gradient(to bottom, rgba(10,14,28,0.9), rgba(10,14,28,0.35));
  border-bottom: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(10px);
}
.brand{ display:flex; gap:10px; align-items:center; }
.dot{
  width: 10px; height: 10px; border-radius: 99px;
  background: rgba(130,190,255,0.9);
  box-shadow: 0 0 18px rgba(130,190,255,0.35);
}
.txt .title{ font-weight: 650; font-size: 13px; }
.txt .sub{ font-size: 12px; color: rgba(255,255,255,0.62); margin-top: 2px; }
.right{ display:flex; gap: 10px; align-items:center; flex-wrap:wrap; justify-content:flex-end; }
button.active{
  border-color: rgba(130,190,255,0.42);
  background: rgba(130,190,255,0.10);
}
</style>
