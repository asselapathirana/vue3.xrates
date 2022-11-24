<template>
  <!-- Mustaches cannot be used inside HTML attributes. Instead, use a v-bind directive. v-bind:id= shortcut :id= -->
  <div :id="id"></div>
</template>

<script setup>

import { ref, onMounted, computed, onUnmounted } from 'vue'
import  Plotly  from 'plotly.js-dist/plotly'
import uuid4 from "uuid4";
// import pinia store and instantiate
import { useDataStore } from '../stores/data'
const storeData = useDataStore()


// debounce code https://dev.to/sandrarodgers/listen-for-and-debounce-window-resize-event-in-vuejs-2pn2
const debouncedHeight=  0
const debouncedWidth=  0
const heightTimeout=  null
const widthTimeout =  null

const width = computed({
        
        get(){  
            return  this.debouncedHeight;
        },
        set(val)  {
            if  (this.heightTimeout)  clearTimeout(this.heightTimeout);
                this.heightTimeout =  setTimeout(()  =>  {
                this.debouncedHeight = val;
            },  1000);
        },
})

const height = computed({
  get()  {
        return  this.debouncedWidth;
    },
        set(val)  {
            if  (this.widthTimeout)  clearTimeout(this.widthTimeout);
                this.widthTimeout =  setTimeout(()  =>  {
                this.debouncedWidth = val;
            },  1000);
        },
})

//end debounce code

function newPlot(newplot=true){
  storeData.replot(props.type, id)

}


// template props are defined. Then they can be accessed as props.type etc.
const props = defineProps(['type', 'fill', 'hole'])

// generate id as unique
const id = uuid4()

onUnmounted(()=>{
  window.removeEventListener("resize", newPlot);
  storeData.deregisterId(id)
})
onMounted(() => {
  // resize - newPlot
   window.addEventListener("resize", newPlot);
  // send the id to the pinia store
  storeData.registerId(id)
  newPlot()
})
storeData.$subscribe((mutation, state) => {
  newPlot(false)
})


</script>