<template>
  <v-container id="Confirm_Container" fill-height>
    <v-card
      id="Confirm_Card"
      flat
    >
      <v-card-text>
        <div id="Confirm_Message">
          <div>
            <img
              id="Confirm_SubmittedIcon"
              src="/assets/SecretBallot_submitted.svg"
            >
          </div>
          <div class="pt-2">
            Your vote has been submitted!
          </div>
        </div>
        <div class="text-xs-center pt-4">
          <template v-if="open">
            <div id="Confirm_VoteOpenDisclaimer" class="pb-4">
              The results will be available when the ballot closes. <br />
              We advocate for privacy and information disclosure.
            </div>
            <v-btn id="Confirm_ButtonDisabled">
              View result
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              id="Confirm_ButtonEnabled"
              @click="$router.push({ name: 'results', query: $route.query })"
            >
              View result
            </v-btn>
          </template>

          <template v-if="admin">
            <v-btn
              id="Confirm_ButtonEnabled"
              :loading="loading"
              @click="close"
              v-if="open"
            >
              Close vote
            </v-btn>

            <v-btn
              id="Confirm_ButtonDisabled"
              :loading="loading"
              v-else
            >
              Close vote
            </v-btn>
          </template>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Confirm',
  async created () {
    if (!this.$route.query.id) {
      return;
    }
    await this.loadService(this.$route.query.id);

    this.open = await this.getOpen();
    this.admin = await this.isAdmin();
  },
  data () {
    return {
      admin: false,
      loading: false,
      open: true,
    };
  },
  methods: {
    ...mapActions([
      'loadService',
      'closeBallot',
      'isAdmin',
      'getOpen',
    ]),
    async close () {
      this.loading = true;

      // Close ballot
      await this.closeBallot();

      // Check if it was closed
      this.open = await this.getOpen();

      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import '~oasis-style/oasis.scss';

#Confirm_Card {
  background-color: $background-light-gray;

  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 95%;
}

#Confirm_Container {
  position: relative;
  top: 15vh;
}

#Confirm_Message {
  font-family: Sul Sans;
  font-size: 25px;
  font-weight: bold;
  line-height: 29px;
  text-align: center;

  color: #334857;
}

#Confirm_ButtonDisabled {
  @extend .o-btn-disabled;
  width: 139px;
}

#Confirm_ButtonEnabled {
  @extend .o-btn-primary;
  width: 139px;
}

#Confirm_SubmittedIcon {
  height: 40px;
  width: 40px;
}

#Confirm_VoteOpenDisclaimer {
  font-family: Sul Sans;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  text-align: center;

  color: #5B6872;
}

#Confirm_VoteOpenDisclaimer span {
  font-weight: bold;
}
</style>
