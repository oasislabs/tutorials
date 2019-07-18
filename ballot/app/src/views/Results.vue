<template>
  <v-container id="Results_Container" fill-height>
    <v-card
      id="Results_Card"
      flat
    >
      <v-card-title id="Results_Title" class="justify-center">
        Result
      </v-card-title>

      <v-card-text>
        <v-apex-chart
          align="center"
          width="250"
          type="pie"
          :options="chartOptions"
          :series="series"
        ></v-apex-chart>

        <div id="Results_Question" class="pb-4">
          <b>Question:</b> <br />
          {{ question }}
        </div>

        <template v-for="(option, index) of chartOptions.labels">
          <div
            class="Results_Result pl-5 pa-2 pt-1"
            :key="'result-' + index"
          >
            <div class="Results_Number pr-4">#{{ index + 1 }}</div>
            <div class="Results_Option pt-2">{{ option }}</div>
            <div class="Results_Score pt-2 pr-5">{{ series[index] }}%</div>
          </div>
          <v-divider
            class="Results_Divider"
            :key="'divider-' + index"
          ></v-divider>
        </template>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Results',
  async created () {
    this.question = await this.getDescription();

    const labels = await this.getCandidates();
    const series = await this.getResults();

    // Process results
    const totalVotes = series.reduce((total, votes) => total + votes, 0);
    const zip = series
      .map((count, index) => [labels[index], count])
      .sort((a, b) => b[1] - a[1]);

    this.chartOptions.labels = zip.map(pair => pair[0]);
    this.series = zip.map(pair => pair[1] * 100 / totalVotes);
  },
  data () {
    return {
      question: '',
      series: [],
      chartOptions: {
        legend: {
          show: false,
        },
        labels: [],
        plotOptions: {
          pie: {
            dataLabels: {
              minAngleToShowLabel: 361,
            },
          },
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 170,
            },
            legend: {
              show: false,
            },
          },
        }],
        tooltip: {
          fillSeriesColor: false,
          y: {
            formatter: (value) => {
              return `${value}%`;
            },
          },
        },
        theme: {
          monochrome: {
            enabled: true,
            color: '#ff4212',
            shadeIntensity: 0.9,
          },
        },
      },
    };
  },
  methods: {
    ...mapActions([
      'getDescription',
      'getCandidates',
      'getResults',
    ]),
  },
};
</script>

<style scoped lang="scss">
@import '~oasis-style/oasis.scss';

.apexcharts-tooltip {
  background-color: $dark-gray;
  color: $dark-gray;
}

#Results_Card {
  background-color: $background-light-gray;

  display: block;
  margin-left: auto;
  margin-right: auto;
}

#Results_Container {
  position: relative;
  top: 5vh;

  overflow-y: scroll;
}

#Results_Question {
  font-family: Sul Sans;
  font-size: 14px;
  line-height: 16px;
  text-align: center;

  color: #c3c9cd;

  mix-blend-mode: normal;
}

#Results_Title {
  font-family: Sul Sans;
  font-size: 28px;
  font-weight: bold;
  line-height: 33px;

  text-transform: uppercase;
  letter-spacing: 2px;

  color: #334857;
}

.Results_Divider {
  width: 150%;
}

.Results_Number {
  float: left;

  font-family: Sul Sans;
  font-size: 28px;
  font-weight: bold;
  line-height: 33px;

  color: #334857;
}

.Results_Option {
  float: left;

  font-family: Sul Sans;
  font-size: 16px;
  line-height: 19px;

  color: #334857;
}

.Results_Result {
  height: 56px;
  width: 480px;
  margin-left: 60px;
  margin-right: 60px;
}

.Results_Score {
  float: right;

  font-family: Sul Sans;
  font-size: 16px;
  line-height: 19px;
  text-align: center;

  color: #334857;
}
</style>
