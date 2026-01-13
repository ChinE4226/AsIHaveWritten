import { ref, onBeforeUnmount } from "vue";

export function useDraggable(rootElRef, handleElRef) {
  const x = ref(0);
  const y = ref(0);

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;

  function clampToViewport(nx, ny, pad = 18) {
    const el = rootElRef.value;
    if (!el) return { nx, ny };

    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const minX = pad;
    const minY = pad;
    const maxX = window.innerWidth - w - pad;
    const maxY = window.innerHeight - h - pad;

    return {
      nx: Math.min(Math.max(nx, minX), Math.max(minX, maxX)),
      ny: Math.min(Math.max(ny, minY), Math.max(minY, maxY))
    };
  }

  function onPointerDown(e) {
    // Only left click / primary touch
    if (e.button !== undefined && e.button !== 0) return;

    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    baseX = x.value;
    baseY = y.value;

    // capture pointer to avoid losing drag
    e.currentTarget.setPointerCapture?.(e.pointerId);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const { nx, ny } = clampToViewport(baseX + dx, baseY + dy, 18);
    x.value = nx;
    y.value = ny;
  }

  function onPointerUp() {
    dragging = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }

  function initCentered({ width = 980, height = 520, clampPadding = 18 } = {}) {
    // Center based on current viewport
    const nx = Math.round((window.innerWidth - width) / 2);
    const ny = Math.round((window.innerHeight - height) / 2);

    const clamped = clampToViewport(nx, ny, clampPadding);
    x.value = clamped.nx;
    y.value = clamped.ny;

    // Attach listeners
    const handle = handleElRef.value;
    if (handle) {
      handle.addEventListener("pointerdown", onPointerDown);
    }
  }

  onBeforeUnmount(() => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);

    const handle = handleElRef.value;
    if (handle) {
      handle.removeEventListener("pointerdown", onPointerDown);
    }
  });

  return { x, y, initCentered };
}
