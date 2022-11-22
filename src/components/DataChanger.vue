<script setup >
import {  onMounted } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
//import pinia store and instantiate
import { useDataStore } from '../stores/data'
const storeData = useDataStore()


</script>

<template>
    <!-- Drop down with type-ahead for currencies -->
    <div style="--vs-dropdown-color: black;"> <!-- https://vue-select.org/guide/css.html -->
    <v-select :options="storeData.currencies"></v-select>
    </div>
</template>

