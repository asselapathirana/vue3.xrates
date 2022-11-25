<script setup >
import {  ref } from 'vue'
import vSelect from 'vue-select'
import Multiselect from 'vue-multiselect'

import 'vue-select/dist/vue-select.css'
import 'vue-multiselect/dist/vue-multiselect.css'
//import pinia store and instantiate
import { useDataStore } from '../stores/data'
const storeData = useDataStore()

const selected=ref([]) // even when you don't use the v-model, it is needed for the component to function

</script>

<template>
    <!-- Drop down with type-ahead for currencies -->
    <multiselect 
    v-model="selected" 
    track-by="code"
    label="label"
    :multiple="true"
    :options="storeData.currencies" 
    placeholder="Select currencies" 
    v-on:update:modelValue="storeData.changeData" 
> </multiselect><!-- see https://stackoverflow.com/a/68316374 for v-on:update:modelValue="storeData.changeData"-->
 </template>

