<template>
  <div class="text">
    <p>{{ visible }}</p>
  </div>
</template>

<script>
export default {
  name: "TypewriterText",
  props: {
    text: { type: String, default: "" },
    speedMs: { type: Number, default: 22 },
    skip: { type: Boolean, default: false }
  },
  data() {
    return {
      visible: "",
      i: 0,
      timer: null,
      typing: false
    };
  },
  watch: {
    text: function () {
      this.start();
    },
    skip: function (v) {
      if (v && this.text) this.finish();
    }
  },
  mounted() {
    this.start();
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    emitTyping(v) {
      this.$emit("typing", v);
    },
    start() {
      this.clearTimer();
      this.visible = "";
      this.i = 0;

      if (!this.text) {
        this.emitTyping(false);
        this.$emit("done");
        return;
      }

      if (this.skip) {
        this.finish();
        return;
      }

      this.typing = true;
      this.emitTyping(true);

      const step = Math.max(8, Number(this.speedMs) || 22);

      this.timer = setInterval(() => {
        this.i += 1;
        this.visible = this.text.slice(0, this.i);

        if (this.i >= this.text.length) {
          this.finish();
        }
      }, step);
    },
    finish() {
      this.clearTimer();
      this.visible = this.text;
      if (this.typing) {
        this.typing = false;
        this.emitTyping(false);
      }
      this.$emit("done");
    }
  }
};
</script>

<style scoped>
.text {
  padding-top: 12px;
  min-height: 140px;
}
p {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.25);
  white-space: pre-wrap;
}
</style>
