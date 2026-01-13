<template>
  <DesktopWindow
    :title="pageTitle"
    subtitle="Beyond Myth"
    :footerLeftLabel="leftBadgeLabel"
    :footerRightPrimary="'Main Page'"
    :footerRightSecondary="clockText"
    @requestClose="handleClose"
  >
    <div class="content">
      <div class="grid" role="list" aria-label="Files">
        <AppIcon
          v-for="item in items"
          :key="item.id"
          :item="item"
          @open="openItem"
        />
      </div>

      <div class="tips">
        <div class="kbd-hint">Tip: Drag the window by the top bar. Press <b>Esc</b> to close modals.</div>
      </div>
    </div>

    <FileViewerModal
      v-if="viewer.open"
      :title="viewer.title"
      :type="viewer.type"
      :content="viewer.content"
      @close="viewer.open = false"
    />

    <AudioPlayerModal
      v-if="audio.open"
      :title="audio.title"
      :src="audio.src"
      @close="audio.open = false"
    />
  </DesktopWindow>
</template>

<script setup>
import { reactive, computed, onMounted, onBeforeUnmount } from "vue";
import DesktopWindow from "./DesktopWindow.vue";
import AppIcon from "./AppIcon.vue";
import FileViewerModal from "./FileViewerModal.vue";
import AudioPlayerModal from "./AudioPlayerModal.vue";
import { useClock } from "./composables/useClock.js";

const pageTitle = "As I've Written";
const leftBadgeLabel = "Author's Ritual";

const { now } = useClock();
const clockText = computed(() => {
  const d = now.value;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
});

/**
 * Main interactive items.
 * You can extend these to match the real game’s “exe/wav” vibe.
 */
const items = [
  {
    id: "exe-1",
    label: "Heroic Chronicle.exe",
    kind: "exe",
    icon: "book",
    content:
      "A compact executable archive.\n\nFunctions:\n- Open: shows metadata and a preview.\n- Pin: keeps it highlighted.\n- Inspect: reveals additional notes."
  },
  {
    id: "exe-2",
    label: "Pathseeker's Fate.exe",
    kind: "exe",
    icon: "spiral",
    content:
      "A path computation module.\n\nDemo logic:\n- Clicking opens the viewer.\n- Viewer supports Copy / Download.\n- Stable keyboard handling (Esc to close)."
  },
  {
    id: "exe-3",
    label: "Labyrinth.exe",
    kind: "exe",
    icon: "creature",
    content:
      "A simulated labyrinth runner.\n\nDemo:\n- This UI is not the game.\n- It imitates the file-launch feel.\n- Replace content with your real data later."
  },
  {
    id: "wav-1",
    label: "Administrator Note.wav",
    kind: "audio",
    icon: "audio",
    src: "/demo-audio.wav"
  },
  {
    id: "exe-4",
    label: "delta-me13.exe",
    kind: "exe",
    icon: "target",
    content:
      "A target calibration tool.\n\nDemo:\n- Viewer shows structured text.\n- You can export content as .txt.\n- Safe, dependency-light, Vite-based."
  }
];

const viewer = reactive({
  open: false,
  title: "",
  type: "exe",
  content: ""
});

const audio = reactive({
  open: false,
  title: "",
  src: ""
});

function openItem(item) {
  if (item.kind === "audio") {
    audio.open = true;
    audio.title = item.label;
    audio.src = item.src;
    viewer.open = false;
    return;
  }

  viewer.open = true;
  viewer.title = item.label;
  viewer.type = item.kind;
  viewer.content = item.content ?? "(No content)";
  audio.open = false;
}

function handleClose() {
  // In-game it would go back to previous UI. Here we just show a gentle action.
  viewer.open = false;
  audio.open = false;
  // You can route to another page here if you add vue-router later.
}

function onKeyDown(e) {
  if (e.key === "Escape") {
    viewer.open = false;
    audio.open = false;
  }
}

onMounted(() => window.addEventListener("keydown", onKeyDown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeyDown));
</script>

<style scoped>
.content{
  height:100%;
  width:100%;
  display:flex;
  flex-direction:column;
  gap: 14px;
  padding: 18px 18px 12px 18px;
}

.grid{
  display:grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 20px 22px;
  align-content:start;
  padding-top: 10px;
}

.tips{
  margin-top:auto;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

@media (max-width: 980px){
  .grid{ grid-template-columns: repeat(2, minmax(160px, 1fr)); }
}
@media (max-width: 640px){
  .grid{ grid-template-columns: 1fr; }
}
</style>
