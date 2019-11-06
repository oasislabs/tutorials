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

        <div class="Results_ResultsContainer" ref="ResultsContainer">
          <template
            v-for="(option, index) of chartOptions.labels"
            class="Results_Template"
          >
            <div
              class="Results_Result pl-5 pa-2 pt-1"
              :key="'result-' + index"
            >
              <div class="Results_Number Results_Text pr-4">#{{ index + 1 }}</div>
              <div class="Results_Option Results_Text pt-2">{{ option }}</div>
              <div class="Results_Score Results_Text pt-2 pr-5">{{ series[index] }}%</div>
            </div>
            <v-divider
              class="Results_Divider"
              :key="'divider-' + index"
            ></v-divider>
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Results',
  async created () {
    if (!this.$route.query.id) {
      return;
    }
    await this.loadService(this.$route.query.id);

    // Check if the vote is closed, and redirect to vote page if it's not
    const open = await this.getOpen();
    if (open) {
      this.$router.push({ name: 'vote', query: this.$route.query });
      return;
    }

    this.question = await this.getDescription();

    const labels = await this.getCandidates();
    const series = await this.getResults();

    // Process results
    const totalVotes = series.reduce((total, votes) => total + votes, 0);
    const zip = series
      .map((count, index) => [labels[index], count])
      .sort((a, b) => b[1] - a[1]);

    // Initialize results chart
    this.chartOptions = {
      ...this.chartOptions,
      ...{
        labels: zip.map(pair => pair[0])
      },
    };
    this.series = zip.map(pair => pair[1] * 100 / totalVotes);
  },
  data () {
    return {
      question: '',
      series: [],
      chartOptions: {
        labels: [],
        legend: {
          show: false,
        },
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
      'loadService',
      'getDescription',
      'getCandidates',
      'getOpen',
      'getResults',
    ]),
  },
};
</script>

<style scoped lang="scss">
@import '~oasis-style/oasis.scss';

#Results_Card {
  background-color: $background-light-gray;

  display: block;
  margin-left: auto;
  margin-right: auto;
}

#Results_Container {
  position: relative;
  top: 5vh;
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
  max-width: 80vw;

  width: 100%;
  margin: 0 auto;
}

.Results_ResultsContainer {
  width: 500px;
  max-width: 80vw;
}

.Results_ResultsContainer:hover .Results_Text {
  opacity: 0.33;
}

.Results_Result:hover .Results_Text {
  opacity: 1.00;
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
