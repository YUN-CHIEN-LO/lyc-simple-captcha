<template>
  <div class="lyc-simple-captcha-vue">
    <canvas ref="lycCaptchaDOM" :width="width" :height="height"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, onMounted } from "vue";

const props = defineProps({
  // 驗證碼區塊寬度
  width: {
    type: Number,
    default: 150,
  },
  // 驗證碼區塊高度
  height: {
    type: Number,
    default: 40,
  },
  // 驗證碼位數
  length: {
    type: Number,
    default: 6,
  },
});

const { width, height, length } = toRefs(props);
const lycCaptchaDOM = ref<HTMLCanvasElement>();
const lycCaptcha = ref("");

/**
 * 取隨機數字
 *
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} - 隨機數字
 */
function randomNum(min: number, max: number): number {
  const crypto = window.crypto || window.Crypto;
  const randomBuffer = new Uint32Array(1);
  const randomNumber =
    crypto.getRandomValues(randomBuffer)[0] / (0xffffffff + 1);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomNumber * (max - min + 1)) + min;
}

/**
 * 設置隨機大寫英文+數字
 *
 * @returns {string} - 題目字串
 */
function getRandomText() {
  const crypto = window.crypto || window.Crypto;
  const randomBuffer = new Uint32Array(1);
  const random = (crypto.getRandomValues(randomBuffer)[0] / (0xffffffff + 1))
    .toString(36)
    .substring(2, length.value + 2);
  // 因 0 & O 、 i & 1L 很接近，替換為其他字
  const randomReplace = (random as string)
    .replaceAll("0", "a")
    .replaceAll("i", "x")
    .replaceAll("l", "m");
  const upperCaseMod = randomNum(2, 5);
  return randomReplace
    .split("")
    .map((char, index) =>
      index % upperCaseMod === 0 ? char.toUpperCase() : char
    )
    .join("");
}

/**
 * 初始驗證碼
 */
function initCaptcha() {
  if (!lycCaptchaDOM.value) return;
  const canvasDOM = lycCaptchaDOM.value;
  const ctx = canvasDOM.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;

  // 取得驗證碼
  const captchaText = getRandomText();

  // 重置內容
  ctx.clearRect(0, 0, width.value, height.value);
  // 設置字體大小
  ctx.font = "20px Noto Sans TC";
  // 畫底色
  ctx.fillStyle = "#3b3b3b";
  ctx.fillRect(0, 0, width.value, height.value);
  // 畫驗證碼文字
  captchaText.split("").forEach((text, index) => {
    const deg = randomNum(-30, 30);
    const x = (width.value - 10) / (length.value + 1);
    const y = height.value / 1.45;
    ctx.fillStyle = "#FFFFFF";
    // 旋轉角度、改x y位置
    ctx.translate(x * (index + 1), y);
    ctx.rotate((deg * Math.PI) / 180);
    // 設置數字
    ctx.fillText(text, 0, 0);
    // 恢復角度、x y位置
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x * (index + 1), -y);
  });

  lycCaptcha.value = captchaText;
}

/**
 * 更新驗證碼
 */
function refresh() {
  // 重新產生隨機驗證碼
  initCaptcha();
}

/**
 * 驗證 captcha
 * @param {string} value - 驗證字串
 */
function validation(value: string) {
  return new Promise((resolve, reject) => {
    if (value === lycCaptcha.value) resolve(value);
    else reject();
  });
}

onMounted(() => {
  initCaptcha();
});

defineExpose({ refresh, validation });
</script>

<style scoped lang="scss">
.lyc-simple-captcha-vue {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
