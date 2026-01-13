import { ref, onMounted, onBeforeUnmount } from "vue";

export function useClock() {
  const now = ref(new Date());
  let t = null;

  onMounted(() => {
    // Update every 1s for stable clock behavior
    t = window.setInterval(() => (now.value = new Date()), 1000);
  });

  onBeforeUnmount(() => {
    if (t) window.clearInterval(t);
  });

  return { now };
}
