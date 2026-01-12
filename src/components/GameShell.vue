<template>
  <div class="shell" @click="onGlobalClick">
    <div class="bg" :style="bgStyle" />

    <TopBar
      :isAuto="state.isAuto"
      :isSkip="state.isSkip"
      @toggleAuto="toggleAuto"
      @toggleSkip="toggleSkip"
      @openHistory="ui.historyOpen = true"
      @openSettings="ui.settingsOpen = true"
      @openSaveLoad="ui.saveLoadOpen = true"
      @restart="restart"
    />

    <div class="stage">
      <div class="portrait" v-if="portraitUrl">
        <img :src="portraitUrl" alt="portrait" draggable="false" />
        <div class="portraitGlow" />
      </div>

      <DialogueBox
        :speaker="node.speaker"
        :title="node.title"
        :text="node.text"
        :textSpeed="state.textSpeed"
        :skipTyping="state.isSkip"
        :autoAdvance="state.isAuto"
        :autoDelayMs="state.autoDelayMs"
        @typing="typing = $event"
        @done="onTypingDone"
        @requestNext="advanceIfPossible"
      />

      <ChoicesPanel
        v-if="showChoices"
        :choices="node.choices || []"
        @choose="choose"
      />
    </div>

    <HistoryDrawer
      :open="ui.historyOpen"
      :items="history"
      @close="ui.historyOpen = false"
      @jump="jumpTo"
      @clear="clearHistory"
    />

    <SettingsModal
      :open="ui.settingsOpen"
      :settings="state"
      @close="ui.settingsOpen = false"
      @update="updateSettings"
    />

    <SaveLoadModal
      :open="ui.saveLoadOpen"
      :slots="saveSlots"
      @close="ui.saveLoadOpen = false"
      @save="saveToSlot"
      @load="loadFromSlot"
      @delete="deleteSlot"
    />

    <div class="hint">
      <span class="kbd">Space</span> next • <span class="kbd">H</span> history • <span class="kbd">S</span> save/load • <span class="kbd">Esc</span> close
    </div>
  </div>
</template>

<script>
import script from "../data/script.json";
import TopBar from "./TopBar.vue";
import DialogueBox from "./DialogueBox.vue";
import ChoicesPanel from "./ChoicesPanel.vue";
import SettingsModal from "./SettingsModal.vue";
import HistoryDrawer from "./HistoryDrawer.vue";
import SaveLoadModal from "./SaveLoadModal.vue";

const LS_KEY = "hsr_like_dialogue_state_v1";
const SAVE_KEY = "hsr_like_dialogue_saves_v1";

function safeAssetUrl(name) {
  try {
    // If you provide assets in src/assets, Vue CLI will bundle them.
    return new URL(`../assets/${name}`, import.meta.url).href;
  } catch {
    return "";
  }
}

export default {
  components: { TopBar, DialogueBox, ChoicesPanel, SettingsModal, HistoryDrawer, SaveLoadModal },
  data() {
    return {
      ui: { historyOpen: false, settingsOpen: false, saveLoadOpen: false },
      state: {
        nodeId: script.start,
        isAuto: false,
        isSkip: false,
        textSpeed: 22,      // ms per char
        autoDelayMs: 700,   // delay after typing done
        sfx: false
      },
      typing: false,
      history: [],
      saveSlots: []
    };
  },
  computed: {
    node() {
      return script.nodes[this.state.nodeId] || { speaker: "System", title: "Missing Node", text: "Node not found.", choices: [] };
    },
    portraitUrl() {
      if (!this.node.portrait) return "";
      return safeAssetUrl(this.node.portrait);
    },
    bgStyle() {
      const bg = this.node.bg ? safeAssetUrl(this.node.bg) : "";
      if (!bg) {
        return { background: "radial-gradient(900px 600px at 50% 30%, rgba(130,190,255,0.18), transparent 60%), radial-gradient(900px 700px at 20% 50%, rgba(165,120,255,0.12), transparent 65%)" };
      }
      return {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url(${bg})`
      };
    },
    showChoices() {
      // show choices only when typing is finished (unless skip is on)
      const hasChoices = (this.node.choices || []).length > 0;
      if (!hasChoices) return false;
      if (this.state.isSkip) return true;
      return !this.typing;
    }
  },
  created() {
    this.loadState();
    this.loadSlots();
    this.pushHistoryFromNode(true);
    window.addEventListener("keydown", this.onKeyDown);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  },
  methods: {
    onKeyDown(e) {
      if (e.key === "Escape") {
        this.ui.historyOpen = false;
        this.ui.settingsOpen = false;
        this.ui.saveLoadOpen = false;
        return;
      }
      if (this.ui.historyOpen || this.ui.settingsOpen || this.ui.saveLoadOpen) return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        this.advanceIfPossible();
      }
      if (e.key.toLowerCase() === "h") this.ui.historyOpen = true;
      if (e.key.toLowerCase() === "s") this.ui.saveLoadOpen = true;
      if (e.key.toLowerCase() === "a") this.toggleAuto();
      if (e.key.toLowerCase() === "k") this.toggleSkip();
    },
    onGlobalClick() {
      // Click to advance when no choices are showing
      if (this.ui.historyOpen || this.ui.settingsOpen || this.ui.saveLoadOpen) return;
      if (this.showChoices) return;
      this.advanceIfPossible();
    },
    onTypingDone() {
      // auto-advance happens inside DialogueBox via emit requestNext
    },
    advanceIfPossible() {
      const choices = this.node.choices || [];
      if (choices.length === 1 && !this.typing) {
        this.choose(0);
      }
      // Otherwise wait for user to pick a choice
    },
    choose(index) {
      const choices = this.node.choices || [];
      const choice = choices[index];
      if (!choice) return;

      this.state.nodeId = choice.to;
      this.persistState();
      this.pushHistoryFromNode();
    },
    jumpTo(nodeId) {
      if (!script.nodes[nodeId]) return;
      this.state.nodeId = nodeId;
      this.persistState();
    },
    pushHistoryFromNode(isBoot = false) {
      const n = this.node;
      const item = {
        id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
        nodeId: this.state.nodeId,
        speaker: n.speaker || "System",
        title: n.title || "",
        text: n.text || "",
        at: new Date().toISOString()
      };
      // prevent duplicate on boot if already same last node
      const last = this.history[this.history.length - 1];
      if (!isBoot && last && last.nodeId === item.nodeId) return;
      this.history.push(item);
      if (this.history.length > 200) this.history.shift();
    },
    clearHistory() {
      this.history = [];
      this.pushHistoryFromNode(true);
    },
    toggleAuto() {
      this.state.isAuto = !this.state.isAuto;
      if (this.state.isAuto) this.state.isSkip = false;
      this.persistState();
    },
    toggleSkip() {
      this.state.isSkip = !this.state.isSkip;
      if (this.state.isSkip) this.state.isAuto = false;
      this.persistState();
    },
    updateSettings(patch) {
      this.state = { ...this.state, ...patch };
      this.persistState();
    },
    restart() {
      this.state.nodeId = script.start;
      this.state.isAuto = false;
      this.state.isSkip = false;
      this.history = [];
      this.persistState();
      this.pushHistoryFromNode(true);
    },
    persistState() {
      localStorage.setItem(LS_KEY, JSON.stringify({ state: this.state, history: this.history }));
    },
    loadState() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.state?.nodeId && script.nodes[parsed.state.nodeId]) this.state = { ...this.state, ...parsed.state };
        if (Array.isArray(parsed?.history)) this.history = parsed.history.slice(-200);
      } catch {}
    },
    loadSlots() {
      try {
        const raw = localStorage.getItem(SAVE_KEY);
        this.saveSlots = raw ? JSON.parse(raw) : this.defaultSlots();
      } catch {
        this.saveSlots = this.defaultSlots();
      }
    },
    defaultSlots() {
      return Array.from({ length: 6 }).map((_, i) => ({
        slot: i + 1,
        title: "",
        savedAt: "",
        payload: null
      }));
    },
    saveToSlot(slotNum) {
      const idx = this.saveSlots.findIndex(s => s.slot === slotNum);
      if (idx < 0) return;
      const payload = { state: this.state, history: this.history };
      this.saveSlots[idx] = {
        slot: slotNum,
        title: `${this.node.speaker || "System"} — ${this.node.title || "Scene"}`,
        savedAt: new Date().toISOString(),
        payload
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveSlots));
    },
    loadFromSlot(slotNum) {
      const slot = this.saveSlots.find(s => s.slot === slotNum);
      if (!slot?.payload) return;
      const { state, history } = slot.payload;
      if (state?.nodeId && script.nodes[state.nodeId]) this.state = { ...this.state, ...state };
      if (Array.isArray(history)) this.history = history.slice(-200);
      this.persistState();
    },
    deleteSlot(slotNum) {
      const idx = this.saveSlots.findIndex(s => s.slot === slotNum);
      if (idx < 0) return;
      this.saveSlots[idx] = { slot: slotNum, title: "", savedAt: "", payload: null };
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.saveSlots));
    }
  }
};
</script>

<style scoped>
.shell{
  height:100vh;
  width:100vw;
  position:relative;
}
.bg{
  position:absolute; inset:0;
  background-size: cover;
  background-position: center;
  filter: saturate(1.05) contrast(1.05);
  transform: scale(1.02);
}
.stage{
  position:absolute;
  inset: 64px 22px 22px 22px;
  display:flex;
  align-items:flex-end;
  gap: 18px;
}
.portrait{
  width: 360px;
  max-width: 38vw;
  position: relative;
  pointer-events:none;
  user-select:none;
}
.portrait img{
  width:100%;
  height:auto;
  filter: drop-shadow(0 30px 60px rgba(0,0,0,0.55));
}
.portraitGlow{
  position:absolute;
  inset: 40% 10% -10% 10%;
  background: radial-gradient(closest-side, rgba(130,190,255,0.22), transparent 60%),
              radial-gradient(closest-side, rgba(165,120,255,0.16), transparent 65%);
  filter: blur(18px);
  z-index:-1;
}
.hint{
  position:absolute;
  right: 18px;
  bottom: 14px;
  color: rgba(255,255,255,0.55);
  font-size: 12px;
  display:flex;
  gap: 8px;
  align-items:center;
  user-select:none;
}
@media (max-width: 900px){
  .portrait{ display:none; }
  .stage{ inset: 64px 14px 14px 14px; }
}
</style>
