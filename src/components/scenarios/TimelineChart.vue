<template>
  <div id="chart_div"></div>
</template>
<script>
/* eslint-disable no-undef*/
import { mapState } from 'vuex';
import { EventBus } from '@/eventbus';
import { hasOwnProperty } from '@/utils';

export default {
  computed: {
    ...mapState({
      chartData: state => state.timeline.currentTimeline
    })
  },
  methods: {
    drawChart: function () {
      let formatting = {
        options: [
          { color: '#3366CC', shape: 'circle' },
          { color: '#DC3912', shape: 'circle' },
          { color: '#FF9900', shape: 'circle' },
          { color: '#109618', shape: 'circle' },
          { color: '#990099', shape: 'circle' },
          { color: '#3B3EAC', shape: 'circle' },
          { color: '#0099C6', shape: 'circle' },
          { color: '#DD4477', shape: 'circle' },
          { color: '#66AA00', shape: 'circle' },
          { color: '#B82E2E', shape: 'circle' },
          { color: '#316395', shape: 'circle' },
          { color: '#994499', shape: 'circle' },
          { color: '#22AA99', shape: 'circle' },
          { color: '#AAAA11', shape: 'circle' },
          { color: '#6633CC', shape: 'circle' },
          { color: '#E67300', shape: 'circle' },
          { color: '#8B0707', shape: 'circle' },
          { color: '#329262', shape: 'circle' },
          { color: '#5574A6', shape: 'circle' },
          { color: '#3B3EAC', shape: 'circle' }
        ],
        names: []
      };
      let modelNames = {};
      function getNum(name) {
        if (!hasOwnProperty(modelNames, name)) {
          modelNames[name] = Object.keys(modelNames).length;
        }
        return modelNames[name];
      }
      let mapData = this.chartData.map(item => {
        return [
          item.timestamp,
          getNum(item.model_name),
          this.printPrettyTooltip(item),
          this.printPrettyPoint(item, formatting)
        ];
      });
      let chartDiv = document.getElementById('chart_div');

      var data = new google.visualization.DataTable();

      data.addColumn('number', 'timestamp');
      data.addColumn('number', 'model name');
      data.addColumn({ type: 'string', role: 'tooltip', p: { html: true } });
      data.addColumn({ type: 'string', role: 'style' });
      data.addRows(mapData);

      let options = {
        title: 'Updates per model-type (click on update to download)',
        hAxis: {
          title: 'timestamp',
          titleTextStyle: {
            color: '#6D8CA2'
          },
          textStyle: {
            color: '#6D8CA2'
          },
          gridlines: {
            color: '#6D8CA2'
          }
        },
        vAxis: {
          title: 'Model',
          titleTextStyle: {
            color: '#6D8CA2'
          },
          textStyle: {
            color: '#6D8CA2'
          },
          gridlines: {
            count: modelNames.length + 1,
            color: '#6D8CA2'
          }
        },
        tooltip: {
          isHtml: true,
          textStyle: {
            color: '#00003b',
            fontSize: 15
          }
        },
        pointSize: 15,
        pointShape: { type: 'circle' },
        legend: 'none',
        width: '100%',
        height: 400,
        fontName: 'Source Sans Pro',
        backgroundColor: { fill: 'transparent' }
      };
      var chart = new google.visualization.ScatterChart(chartDiv);

      chart.draw(data, options);
      google.visualization.events.addListener(chart, 'select', () => {
        if (!chart.getSelection()[0]) return;
        this.onOpenTimeline(this.chartData[chart.getSelection()[0].row]);
      });
    },
    printPrettyTooltip(item) {
      let html =
        `<div class="chart-tooltip">` +
        `<div>dataset_name: <strong>${item.name}</strong></div>` +
        `<div>dataset_type: <strong>${item.type}</strong></div>` +
        `<div>model_name: <strong>${item.model_name}</strong></div>` +
        `<div>model_type: <strong>${item.model_type}</strong></div>` +
        `<div>timestamp: <strong>${item.timestamp}</strong></div>` +
        `<div>`;
      return html;
    },
    printPrettyPoint(item, formatting) {
      let itemIndex = formatting.names.indexOf(item.model_name);
      if (itemIndex === -1) {
        itemIndex = formatting.names.push(item.model_name) - 1;
      }
      return `point { size: 8; shape-type: ${formatting.options[itemIndex].shape}; fill-color: ${formatting.options[itemIndex].color}; }`;
    },
    onOpenTimeline(item) {
      this.$emit('click', item);
    }
  },
  watch: {
    chartData() {
      this.drawChart();
    }
  },
  created() {
    EventBus.$on('scenarios-active-tab', this.drawChart);
  },
  beforeDestroy() {
    EventBus.$off('scenarios-active-tab', this.drawChart);
  },
  mounted() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => this.drawChart());
  }
};
</script>
<style scoped></style>
