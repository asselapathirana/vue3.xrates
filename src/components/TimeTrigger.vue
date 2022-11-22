<script setup >
//import pinia store and instantiate
import {ref} from 'vue'
import { useDataStore } from '../stores/data'
const storeData = useDataStore()
const isActive = ref(false)
const interval = ref()

function toggle() {
  if (!isActive.value) {
    isActive.value = true;
    interval.value=setInterval(storeData.changeData, 1000)
  } else {
    isActive.value = false;
    clearInterval(interval.value)
  }
}

</script>

<template>
    <!-- Fires the changeData function in data.js pinia store -->
    <button     :class="[isActive? 'btn btn-outline-danger' : 'btn btn-outline-info']"   @click="toggle">{{isActive ? ' ON ' : 'OFF'}}</button>
</template>