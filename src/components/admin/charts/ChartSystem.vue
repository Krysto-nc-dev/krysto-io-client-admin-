<script>

import { Line } from 'vue-chartjs'

import axios from 'axios'

var colors = ["#2196F3", "#FF6F00", "#7884dc", "#4CAF50", "#FFD54F", "#009688", "#1fdffb",
            "#8C9EFF", "#536DFE", "#EF5350", "#D81B60", "#8E24AA", "#B39DDB", "#7B1FA2", "#D4E157",
            "#9CCC65", "#689F38", "#78909C" ]

export default {
  extends: Line,
  props: [],
  data: () => ({
        lineKeys: ['nbUsers', 'nbOffers', 'nbReports', 
                   'nbWalletMain', 'nbWalletDeposit'  ],
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
                maxTicksLimit: 5,
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
  mounted: function(){ if(window.isDev) { console.log("CHART MOUNTED"); }
    //TOP
    
    this.initChart()
    
    this.$root.$on('refreshChartSystem', () => { 
        if(window.isDev) { console.log("on refreshChartSystem"); }
        this.initChart()
    })
    this.$root.$on('showLineSystem', (numLine) => { 
        this.chartData.datasets[numLine].hidden = !this.chartData.datasets[numLine].hidden
        this.$root.$emit('initDataSetSystem', this.chartData.datasets)
        this.$data._chart.update()
    })
    this.$root.$on('showAllLineSystem', (show) => { 
        this.chartData.datasets.forEach((set, i)=>{
            this.chartData.datasets[i].hidden = !show
        })
        this.$root.$emit('initDataSetSystem', this.chartData.datasets)
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
        if(window.isDev) { console.log("renderChart", this.chartData.data, this.chartOptions); }
        this.renderChart(this.chartData, this.chartOptions)
    },
    
    async initChart () {
        await axios.get('/stat/get-state-history')
                    .then(res => {
                        this.initDataSet(res.data.stateHistory)
                        
                        this.chartData.labels = []
                        this.chartData.datasets = []
                        
                        console.log("res stat/get-state-history", res.data)

                        res.data.stateHistory.forEach(history => { 
                            this.addToChart(history, history.date.toString().substr(5, 5))
                        });
                        
                        this.renderChart(this.chartData, this.chartOptions)
                    })
        
    },
    initDataSet: function(){

    },
    addToChart: function(data, label){

        this.lineKeys.forEach((lineKey, l) => {
            if(this.chartData.datasets[l] == null){
                this.chartData.datasets.push({
                        label: lineKey,
                        lineTension: 0.3,
                        borderColor: colors[l],
                        pointRadius: 1,
                        pointBackgroundColor: colors[l],
                        pointBorderColor: colors[l],
                        pointHoverRadius: 3,
                        pointHoverBackgroundColor: colors[l],
                        pointHoverBorderColor: colors[l],
                        pointHitRadius: 10,
                        pointBorderWidth: 1,
                        hidden: (l > 2),
                        data: [], 
              })
            }
            if(this.chartData.datasets[l].data.length > 500){
                this.chartData.datasets[l].data.shift()
                this.chartData.labels.shift()
            }

            this.chartData.datasets[l].data.push(data[lineKey])
            if(l == 0) this.chartData.labels.push(label.substr(0, 10))
        })

        console.log("addToChartSYSTEM", data, label)
        this.$root.$emit('initDataSetSystem', this.chartData.datasets)
    },
  },
}
/*

*/

</script>