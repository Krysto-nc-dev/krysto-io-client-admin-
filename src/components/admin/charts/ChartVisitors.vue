<script>

import { Line } from 'vue-chartjs'

import axios from 'axios'
const config = require('../../../config/' + process.env.NODE_ENV)

var color = ["#2196F3", "#4CAF50", "#009688", "#FF6F00", "#FFD54F", "#A1887F", "#1fdffb",
            "#8C9EFF", "#536DFE", "#EF5350", "#D81B60", "#8E24AA", "#B39DDB", "#7B1FA2", "#D4E157",
            "#9CCC65", "#689F38", "#78909C", ]

export default {
  extends: Line,
  props: [],
  data: () => ({
        chartData: {
              labels: [], //"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              datasets: [],
            },
        chartOptions: {
            maintainAspectRatio: false,
            layout: {
            padding: {
                left: 5,
                right: 15,
                top: 10,
                bottom: 0
            }
            },
            scales: {
            xAxes: [{
                time: {
                    unit: 'date'
                },
                gridLines: {
                    display: true,
                    drawBorder: true
                },
                ticks: {
                    //maxTicksLimit: 5,
                    // callback: function(value) {
                    //     return Math.round(value/30) + ' mois';
                    //     }
                }
            }],
            yAxes: [{
                ticks: {
                maxTicksLimit: 10,
                padding: 0,
                // Include a dollar sign in the ticks
                callback: function(value) {
                    return value;
                }
                },
                gridLines: {
                color: "rgb(50, 50, 50)",
                zeroLineColor: "rgb(234, 236, 244)",
                drawBorder: false,
                borderDash: [0],
                zeroLineBorderDash: [0]
                }
            }],
            },
            legend: {
                display: false
            },
            tooltips: {
            backgroundColor: "rgb(255,255,255)",
            bodyFontColor: "#858796",
            titleMarginBottom: 10,
            titleFontColor: '#6e707e',
            titleFontSize: 14,
            borderColor: '#dddfeb',
            borderWidth: 1,
            xPadding: 15,
            yPadding: 5,
            displayColors: false,
            intersect: false,
            mode: 'index',
            caretPadding: 10,
            callbacks: {
                label: function(tooltipItem, chart) {
                var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
                return datasetLabel + ' : ' + tooltipItem.yLabel;
                //return datasetLabel + ' : ' + number_format(tooltipItem.yLabel) + ' J';
                }
            }
            }
        }
  }),
  mounted: function(){  if(window.isDev) { console.log("CHART MOUNTED"); }
    this.initChart()
    
    this.$root.$on('refreshChartVisitors', () => { 
        this.initChart()
    })
    this.$root.$on('showLine', (numLine) => { 
        this.chartData.datasets[numLine].hidden = !this.chartData.datasets[numLine].hidden
        this.$root.$emit('initDataSet', this.chartData.datasets)
        this.$data._chart.update()
    })
    this.$root.$on('showAllLine', (show) => { 
        this.chartData.datasets.forEach((set, i)=>{
            this.chartData.datasets[i].hidden = !show
        })
        this.$root.$emit('initDataSet', this.chartData.datasets)
        this.$data._chart.update()
    })
    this.$root.$on('addToChart', (data, label) => { 
        this.addToChart(data, label)
        this.$data._chart.update()
    })
    this.$root.$on('rebootChart', (data, label) => { 
        this.chartData.datasets[0].data = []
        this.chartData.labels = []
        this.addToChart(data, label)
        this.$data._chart.update()
    })
    
  },
  
  methods: {
    myRenderChart : async function(){
        this.renderChart(this.chartData, this.chartOptions)
    },
    
    async initChart () {
        this.chartData.datasets = []
        this.chartData.labels = []

        await axios.get('/stat/get-stat-url/' + config.domaineName)
                    .then(res => {
                      this.displayStat(res.data.stats)
                    })
        
    },
    displayStat(stats){
        let statsByUrl = []
        stats.forEach((stat) => {
            let x = null
            statsByUrl.forEach((statB, j) => { if(statB.url == stat.url) x = j })
            if(x == null) statsByUrl.push({ url : stat.url, 
                                            data: [stat.count] })
            else statsByUrl[x].data.push(stat.count)
        })
        if(statsByUrl.length == 0) return
        
        for(let i = statsByUrl[0].data.length-1; i >= 0; i--){
            let dateR = new Date()
            dateR.setDate(dateR.getDate() - i)
            let lbl = (dateR.getDate()) + "/" + (dateR.getMonth() + 1) + "/" + dateR.getFullYear()
            this.chartData.labels.push(lbl)
        }
        

        statsByUrl.forEach((statLine, key) => {
            //console.log("statsByUrl.forEach", statLine, key)
            let randColor = color[key] != null ? color[key] : this.getRandColor()
            let dtset = {
                label: statLine.url,
                lineTension: 0.3,
                //backgroundColor: "rgba(198, 86, 86, 0.26)",
                borderColor: randColor,
                pointRadius: 1,
                pointBackgroundColor: randColor,
                pointBorderColor: randColor,
                pointHoverRadius: 3,
                pointHoverBackgroundColor: randColor,
                pointHoverBorderColor: randColor,
                pointHitRadius: 10,
                pointBorderWidth: 1,
                hidden: (key > 10),
                data: statLine.data
            }
                
            //console.log("dtset", dtset) 
            //console.log("dtset.data", dtset.data) 
            this.chartData.datasets.push(dtset)

        })
        //console.log("FINAL this.chartData.datasets", this.chartData.datasets)
        this.renderChart(this.chartData, this.chartOptions)
        this.$root.$emit('initDataSet', this.chartData.datasets)
        //this.$data._chart.update()
    },
    addToChart: function(data, label){
        if(this.chartData.datasets[0].data.length > 5000){
            this.chartData.datasets[0].data.shift()
            this.chartData.labels.shift()
        }
        this.chartData.datasets[0].data.push(data.nbUsers)
        this.chartData.labels.push(label.substr(0, 10))
        
        //
        if(this.chartData.datasets[1].data.length > 5000){
            this.chartData.datasets[1].data.shift()
            this.chartData.labels.shift()
        }
        this.chartData.datasets[1].data.push(data.nbPosts)
        //this.chartData.labels.push(label.substr(0, 10))
        
        //
        if(this.chartData.datasets[2].data.length > 5000){
            this.chartData.datasets[2].data.shift()
            this.chartData.labels.shift()
        }
        this.chartData.datasets[2].data.push(data.nbNotifs)
        //this.chartData.labels.push(label.substr(0, 10))
    },

    getRandColor (){
        return "#" + Math.floor(Math.random()*16777215).toString(16);
    }
  },
}
/*

*/

</script>