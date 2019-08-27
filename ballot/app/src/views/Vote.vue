<template>
  <v-container id="Vote_Container" fill-height>
    <v-card
      id="Vote_Card"
      flat
    >
      <v-card-text>
        <div id="Vote_Question">
          {{ question }}
        </div>
        <div id="Vote_Reminder" class="pt-3">
          You can only choose one.
        </div>

        <v-radio-group v-model="radios">
          <template v-for="(option, index) of options">
            <div
              :key="index"
              class="Vote_Option pa-3 ma-1"
            >
              <v-radio :value="index">
                <template v-slot:label>
                  <div>{{ option }}</div>
                </template>
              </v-radio>
            </div>
          </template>
        </v-radio-group>

        <div class="text-xs-center">
          <v-btn id="Vote_UnselectedButton"
            v-if="radios === null"
          >
            Submit your vote
          </v-btn>
          <v-btn
            id="Vote_SelectedButton"
            :loading="loading"
            @click="submit"
            v-else
          >
            Submit your vote
          </v-btn>
        </div>
        <div id="Vote_Warning" class="pt-3" v-if="radios !== null">
          <img
            id="Vote_WarningIcon"
            src="/assets/SecretBallot_warn.svg"
          >
          <span class="pl-1">
            Once you submit, you won't be able to change your answer
            or vote again as a different identity.
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Vote',
  async created () {
    if (!this.$route.query.id) {
      return;
    }
    await this.loadService(this.$route.query.id);

    // Check if the vote is closed, and and redirect to results page if it is
    const open = await this.getOpen();
    if (!open) {
      this.$router.push({ name: 'results', query: this.$route.query });
      return;
    }

    this.question = await this.getDescription();
    this.options = await this.getCandidates();
  },
  data () {
    return {
      loading: false,
      options: [],
      question: '',
      radios: null,
    };
  },
  methods: {
    ...mapActions([
      'loadService',
      'castVote',
      'getDescription',
      'getCandidates',
      'getOpen',
    ]),
    async submit () {
      this.loading = true;
      await this.castVote(this.radios);

      this.loading = false;
      this.$router.push({ name: 'confirm', query: this.$route.query });
    },
  },
};
</script>

<style scoped lang="scss">
@import '~oasis-style/oasis.scss';

#Vote_Card {
  background-color: $background-light-gray;

  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 95%;
}

#Vote_Container {
  position: relative;
  top: 5vh;
}

#Vote_Reminder {
  font-family: Sul Sans;
  font-size: 17px;
  line-height: 20px;
  text-align: center;

  color: #5b6872;
}

#Vote_Question {
  font-family: Sul Sans;
  font-size: 25px;
  font-weight: bold;
  line-height: 29px;
  text-align: center;

  color: #334857;
}

#Vote_SelectedButton {
  @extend .o-btn-primary;
  width: 173px;
}

#Vote_UnselectedButton {
  @extend .o-btn-disabled;
  width: 173px;
}

#Vote_Warning {
  font-family: Sul Sans;
  font-size: 14px;
  line-height: 20px;
  text-align: center;

  max-width: 525px;

  color: #5b6872;
  mix-blend-mode: normal;
  opacity: 0.59;
}

#Vote_WarningIcon {
  height: 17.5px;
  width: 16px;

  position: relative;
  top: 4px;
}

.Vote_Option {
  height: 56px;
  width: 525px;
  max-width: 80vw;

  background: white;
  border: 1.5px solid #eaeef1;
  box-sizing: border-box;
  border-radius: 3px;
}
</style>
