import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import  Plotly  from 'plotly.js-dist/plotly'
import * as d3 from 'd3'
import { Collapse } from 'bootstrap'

export const useDataStore = defineStore('counter', () => {
  //ref()s become state properties
  //computed()s become getters
  //function()s become actions
  // see https://pinia.vuejs.org/core-concepts/#setup-stores
  //following are state properties:
  const baseCurrency = ref('EUR')
  const data = ref([])
  const config = ref({})
  const layout = ref({})
  const currencies = ref([])
  const selectedC=ref(new Set())
  const ids = ref(new Set())
  const logscale=ref(false)

  const basePlaceholder = computed(() => {
    return `Select base currency. (Default: ${baseCurrency.value})`
  });

  const selectedCCodes = computed(()=>{
      return Array.from(selectedC.value).map(x=>x.code)
  });


  // set their initial values

  config.value= { displayModeBar: true }
  layout.value= { margin: {l:20, r:20, t:30, b:20} }
  

//https://stackoverflow.com/questions/64117116/how-can-i-use-async-await-in-the-vue-3-0-setup-function-using-typescript
//Note the semicolon - leave it there. 
  ;(async () => {
    const res = await  d3.json("https://api.exchangerate.host/symbols");
    const res2= Object.values(res.symbols).map(obj => ({ ...obj, label: '[ ' +obj.code + ' ] ' + obj.description}))
    currencies.value=Object.values(res2)
  })()


function registerId(id){
  ids.value.add(id)
}

function deregisterId(id){
  ids.value.delete(id)
}

function replot(){
  if (ids.value.size > 0  && selectedC.value.size >0){
    makeplot()
  }
}

function makeplot() {
  var currentDate = new Date()
  var limit = new Date()
  var numOfYears = 1

  limit.setFullYear(currentDate.getFullYear() - numOfYears);


  var url="https://api.exchangerate.host/timeseries?start_date="+
          limit.toJSON().slice(0, 10)+
          "&end_date=" +currentDate.toJSON().slice(0, 10)+
          "&symbols="+selectedCCodes.value.join(',')+
          "&base="+baseCurrency.value
  //console.log("url",url )
  ;(async () => {
    var res
    if (url in data){
      //console.log("old data")
      res = data[url]
    }else{
      //console.log("new!!! ")
      res = await  d3.json(url);
      data[url]=res
    }
    plotData(res)
  })()
};

function plotData(data){
  //console.log("selectedC:", selectedC.value)
  var traces=[]
  var x=Object.keys(data.rates)
  var _y=Object.values(data.rates)
  for (const curr of selectedCCodes.value) {
    //console.log("Doing: ", curr); 
    traces.push({
      x:x,
      y:_y.map(function (co) {
        return co[curr]
    }),
    showlegend: true,
    name: curr,
    }

    )

  }

  if (logscale.value){
    var layout = {
      yaxis: {
        type: 'log',
        autorange: true
      }
    };
  }else{
    layout ={}
  }


  //console.log("traces: ", traces)
  for (const id of ids.value){
    Plotly.newPlot(id, traces, layout);
  }

  //console.log("tr", traces )
}

function changeData(currency){
  selectedC.value=new Set(currency)
  replot()
}

function changeBase(currency){
  baseCurrency.value=currency.code
  replot()
}
// pinia requires to return the data
  return { ids, config, layout,  replot, currencies, selectedC, 
    changeData, changeBase, registerId, deregisterId, baseCurrency, basePlaceholder, logscale}

})


