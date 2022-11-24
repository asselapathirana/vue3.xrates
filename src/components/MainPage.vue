<script setup >
import PlotlyEx from './PlotlyEx.vue'
import DataChanger from './DataChanger.vue'
import TimeTrigger from './TimeTrigger.vue'

// import pinia store and instantiate
import { useDataStore } from '../stores/data'
const storeData = useDataStore()

</script>

<template>

<div class="container-fluid p-5 bg-primary text-white text-center">
  <h1>Exchange rate history</h1>
  <p>Select the Currency</p> 
  <data-changer />
 <!-- <time-trigger /> -->
</div>
  
<div class="container mt-5">
  <div class="row ">
    <div class="card">
    <h3 class="text-center"> {{storeData.baseCurrency}}.x </h3>
    <div >
        <PlotlyEx type="scatter"  />
    </div>
    </div>
    
  </div>

</div>

</template>