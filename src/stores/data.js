import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as d3 from 'd3'

export const useDataStore = defineStore('counter', () => {
  //ref()s become state properties
  //computed()s become getters
  //function()s become actions
  // see https://pinia.vuejs.org/core-concepts/#setup-stores
  //following are state properties:
  const data = ref([])
  const config = ref({})
  const layout = ref({})
  const currencies = ref([])

  // set their initial values
  data.value=setData()
  config.value= { displayModeBar: true }
  layout.value= { margin: {l:20, r:20, t:30, b:20} }
  

  //action to change data
  function changeData(){
    data.value=setData()
  }

//https://stackoverflow.com/questions/64117116/how-can-i-use-async-await-in-the-vue-3-0-setup-function-using-typescript
//Note the semicolon - leave it there. 
  ;(async () => {
    const res = await  d3.json("https://api.exchangerate.host/latest");
    currencies.value=Object.keys(res.rates)
  })()


function getData(type){
  var d = data.value

  if (type=="pie"){
    d=[{values: data.value[0].y,
      labels: data.value[0].x,
      type:type, 
      sort:false}]
  }

  const c=config.value
  const l=layout.value

  //Plotly seem to mutate these values. So, to ensure it does not happen, we deepcopy things. 
  return  {data: JSON.parse(JSON.stringify(d)), 
    config: JSON.parse(JSON.stringify(c)), 
    layout: JSON.parse(JSON.stringify(l)) }
}

  // pinia requires to return the data
  return { data, config, layout , changeData,  getData, currencies}

})



function setData() {
  return [{
    x: [1, 2, 3, 4],
    y: [10 + Math.random(), 15 + Math.random(), 13 + Math.random(), 27 * Math.random()],
    type: "scatter"
  }]
}

