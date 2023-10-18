<template>
  <div>
    <h1>簡易 Captcha 展示</h1>
    <div :class="['demo', { [`is-${status}`]: true }]">
      <LycCaptcha ref="captchaDOM" />
      <button @click="handleRefresh">更新</button>
      <input v-model="validation" placeholder="請輸入驗證碼" />
      <button @click="handleValidate">驗證</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LycCaptcha from "@/components/LycCaptcha.vue";

// captcha 實例
const captchaDOM = ref<InstanceType<typeof LycCaptcha>>();
// 驗證字串
const validation = ref("");
// 驗證狀態
const status = ref("none");

/**
 * 當更新驗證碼
 */
function handleRefresh() {
  if (captchaDOM.value) captchaDOM.value.refresh();
}

/**
 * 當進行驗證
 */
function handleValidate() {
  if (!captchaDOM.value) return;
  captchaDOM.value
    .validation(validation.value)
    .then(() => {
      status.value = "pass";
    })
    .catch(() => {
      status.value = "fail";
    })
    .finally(() => {
      const timer = setTimeout(() => {
        validation.value = "";
        status.value = "none";
        handleRefresh();
        clearTimeout(timer);
      }, 1000);
    });
}
</script>

<style scoped>
.demo {
  background-color: #f5f5f5;
  padding: 36px;
  display: flex;
  margin-bottom: 60px;
  border-radius: 24px;
  box-shadow: 16px 16px #363062;
  transition: background-color 0.3s ease-in-out;
  & > * {
    margin-right: 8px;
    font-size: 18px;
  }
  & > input {
    padding: 0px 16px;
    letter-spacing: 2px;
    &::placeholder {
      color: #dbdbdb;
      opacity: 0.8;
    }
  }
  &.is-pass {
    background-color: #a6ff96;
  }
  &.is-fail {
    background-color: #e25e3e;
  }
}
</style>
