<template>
  <div>
    <line-chart
      :width="500"
      :height="300"
      :labels="labels"
      :datasets="displayedDatasets"
      :options="$options.options"
    ></line-chart>
  </div>
</template>

<script>
import numeral from "numeral";
import LineChart from "./LineChart";

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          callback: (value) => numeral(value).format("$0,0"),
        },
      },
    ],
  },
  tooltips: {
    mode: "index",
    callbacks: {
      label(tooltipItem, data) {
        const label = data.datasetst[tooltipItem.datasetIndex].label;
        const value = numeral(tooltipItem.yLabel).format("$0,0");

        return `${label}: ${value}`;
      },
    },
  },
};

export default {
  name: "monthly-sales-chart",
  options,
  components: {
    LineChart,
  },
  data() {
    return {
      datasetst: {},
    };
  },
  props: ["labels", "selectedYears","datasets"],
  computed: {
    displayedDatasets() {
      return this.selectedYears.map((year) => this.datasets[year]);
    },
  },
  created() {
    this.datasetst = this.datasets;
  },
};
</script>
