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

function newPlot(newplot=true){
 const d=get_data()
  // update plot (react - same signature as newPlot)
  //Plotly.react(id, d.data, d.layout, d.config)
  // but there is a buggy behavior in window sizing so, use inefficient redraw!
  if(newplot){
    Plotly.newPlot(id, d.data, d.layout, d.config)
  }
  else{
    Plotly.react(id, d.data, d.layout, d.config)
  }
  //console.log("newPlotting: ", id)

}
//end debounce code

// template props are defined. Then they can be accessed as props.type etc.
const props = defineProps(['type', 'fill', 'hole'])

// generate id as unique
const id = uuid4()

onUnmounted(()=>{
  window.removeEventListener("resize", newPlot);

})
onMounted(() => {
  // resize - newPlot
   window.addEventListener("resize", newPlot);

  newPlot()
})
storeData.$subscribe((mutation, state) => {
  newPlot(false)
})

function get_data() {
  // get chart data from pina store and customize
  const d=storeData.getData(props.type);
  d.data[0].type=props.type;
  d.data[0].fill=props.fill;
  if (props.hole){
    d.data[0]["hole"]=props.hole
  }
  if (props.type=="bubble"){
    d.data[0]['mode']='markers',
    d.data[0]['marker']={size: d.data[0].y}
  
  }
  //d.layout["margin_autoexpand"]=false;
  //d.layout["margin_r"]=240;
  //console.log("all",d.data, d.config, d.layout)
  return d;
}
</script>