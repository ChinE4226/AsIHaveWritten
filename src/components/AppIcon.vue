<template>
  <button
    class="icon"
    @click="$emit('open', item)"
    @dblclick.prevent="$emit('open', item)"
    role="listitem"
    :aria-label="`Open ${item.label}`"
  >
    <div class="tile">
      <component :is="IconSvg" />
    </div>
    <div class="label">{{ item.label }}</div>
  </button>
</template>

<script setup>
import { computed } from "vue";

defineEmits(["open"]);

const props = defineProps({
  item: { type: Object, required: true }
});

const IconSvg = computed(() => {
  const name = props.item.icon;

  const base = {
    template: `
      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7 3h7l3 3v15H7V3z" stroke="rgba(225,245,255,0.8)" stroke-width="1.5"/>
        <path d="M14 3v4h4" stroke="rgba(225,245,255,0.7)" stroke-width="1.5"/>
      </svg>
    `
  };

  const icons = {
    book: {
      template: `
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 4h9a3 3 0 0 1 3 3v13H8a2 2 0 0 0-2 2V4z" stroke="rgba(225,245,255,0.82)" stroke-width="1.5"/>
          <path d="M6 19h10" stroke="rgba(160,210,255,0.75)" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M9 8h6M9 11h6" stroke="rgba(225,245,255,0.55)" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    },
    spiral: {
      template: `
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4c4.4 0 8 3.6 8 8s-3.6 8-8 8-8-3.6-8-8 3-6 6.5-6c2.6 0 4.8 2.1 4.8 4.8 0 2.3-1.9 4.2-4.2 4.2-2 0-3.6-1.6-3.6-3.6 0-1.7 1.4-3 3-3"
            stroke="rgba(225,245,255,0.8)" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    },
    creature: {
      template: `
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 4c2.3 0 4 1.8 4 4.2 0 1.3-.5 2.6-1.5 3.5L16 13l2.5-1c1.2-.5 2.5.2 2.7 1.5.2 1.1-.5 2.2-1.6 2.4L17 16l.8 2.8c.4 1.3-.5 2.7-1.9 2.7-1 0-1.8-.6-2.1-1.5L13 17l-1 2.9c-.3.9-1.1 1.5-2.1 1.5-1.4 0-2.3-1.4-1.9-2.7L8.8 16l-2.6-.1c-1.1-.2-1.8-1.3-1.6-2.4.2-1.3 1.5-2 2.7-1.5L10 13l1.5-1.3C10.5 10.8 10 9.5 10 8.2 10 5.8 9.7 4 12 4z"
            stroke="rgba(225,245,255,0.8)" stroke-width="1.2" stroke-linejoin="round"/>
        </svg>
      `
    },
    audio: {
      template: `
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M11 5L6 9H3v6h3l5 4V5z" stroke="rgba(225,245,255,0.82)" stroke-width="1.5" stroke-linejoin="round"/>
          <path d="M15.5 9.5a3.5 3.5 0 0 1 0 5" stroke="rgba(160,210,255,0.75)" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M18 7a7 7 0 0 1 0 10" stroke="rgba(225,245,255,0.45)" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    },
    target: {
      template: `
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8" stroke="rgba(225,245,255,0.75)" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="4" stroke="rgba(160,210,255,0.75)" stroke-width="1.5"/>
          <path d="M12 2v3M22 12h-3M12 22v-3M2 12h3" stroke="rgba(225,245,255,0.45)" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      `
    }
  };

  return icons[name] ?? base;
});
</script>

<style scoped>
.icon{
  display:flex;
  flex-direction:column;
  align-items:center;
  gap: 10px;
  padding: 6px 8px;
  border-radius: 12px;
  transition: transform 0.12s ease, background 0.12s ease, box-shadow 0.12s ease;
}
.icon:hover{
  background: rgba(120,160,255,0.06);
  box-shadow: inset 0 0 0 1px rgba(220,235,255,0.10);
  transform: translateY(-1px);
}
.icon:active{
  transform: translateY(0);
}

.tile{
  width: 84px;
  height: 84px;
  border-radius: 14px;
  display:grid;
  place-items:center;
  background: rgba(20,40,75,0.25);
  box-shadow:
    inset 0 0 0 1px rgba(220,235,255,0.10),
    0 10px 30px rgba(0,0,0,0.25);
}

.label{
  font-size: 13px;
  color: rgba(245,250,255,0.80);
  text-shadow: 0 1px 0 rgba(0,0,0,0.35);
  text-align:center;
  max-width: 160px;
  line-height: 1.15;
  word-break: break-word;
}
</style>
