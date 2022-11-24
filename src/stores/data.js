import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import  Plotly  from 'plotly.js-dist/plotly'
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
  const selectedC=ref(new Set())
  const ids = ref(new Set())

  // set their initial values

  config.value= { displayModeBar: true }
  layout.value= { margin: {l:20, r:20, t:30, b:20} }
  

//https://stackoverflow.com/questions/64117116/how-can-i-use-async-await-in-the-vue-3-0-setup-function-using-typescript
//Note the semicolon - leave it there. 
  ;(async () => {
    const res = await  d3.json("https://api.exchangerate.host/latest");
    currencies.value=Object.keys(res.rates)
  })()


function registerId(id){
  ids.value.add(id)
}

function deregisterId(id){
  ids.value.delete(id)
}

function replot(type){
  console.log("replot called for ids:", ids.value.size, " and currencies ", selectedC.value.size)
  if (ids.value.size > 0  && selectedC.value.size >0){
    makeplot()
  }
}

function makeplot() {
  var currentDate = new Date()
  var limit = new Date()
  var numOfYears = 10
  limit.setFullYear(currentDate.getFullYear() - numOfYears);
  var url="https://api.exchangerate.host/timeseries?start_date="+
          limit.toJSON().slice(0, 10)+
          "&end_date=" +currentDate.toJSON().slice(0, 10)+
          "&symbols="+Array.from(selectedC.value).join(',')
  console.log("url",url )
  ;(async () => {
    const res = await  d3.json(url);
    plotData(res)
  })()
};

function plotData(data){
  console.log("data", data)
}

function changeData(currency){
  selectedC.value=new Set(currency)
  replot()
}
// pinia requires to return the data
  return { ids, data, config, layout ,  replot, currencies, selectedC, changeData, registerId, deregisterId}

})


