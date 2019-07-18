<template>
  <v-app id="app">
    <v-toolbar
      id="SecretBallot_Toolbar"
      flat
      app
    >
      <v-toolbar-title
        id="SecretBallot_ToolbarText"
        @click="$router.push({ name: 'welcome', query: $route.query })"
      >
        <img
          id="SecretBallot_ToolbarIcon"
          src="/assets/SecretBallot_icon.svg"
        >
        <b class="pl-2">Secret Ballot</b>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <div class="main">
        <router-view/>
      </div>
    </v-content>

    <v-footer
      id="SecretBallot_Footer"
      class="text-xs-center"
      app
    >
      <v-container>
        <v-flex xs12>
          <v-card
            id="SecretBallot_FooterCard"
            align-center
            flat
          >
            <v-card-text>
              <div id="SecretBallot_FooterText">
                This service is powered by the Oasis Network. <br />
                <a
                  href="https://oasislabs.com"
                  target="_blank"
                >Learn more about Oasis</a>
                or review the
                <a
                  href="https://help.oasislabs.com/en/articles/3117188-beginner-secret-ballot"
                  target="_blank"
                >step-by-step process</a>
                to build this service.
              </div>
            
              <br />
              <br />

              <img
                id="SecretBallot_FooterLogo"
                src="/assets/logo-red.png"
              >
            </v-card-text>
          </v-card>
        </v-flex>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',
  async created () {
    if (this.$route.query.id) {
      await this.loadService(this.$route.query.id);
    } else {
      await this.deployService();

      // Extract and parse ballot ID
      let ballotID = await this.getBallotID();
      ballotID = `0x${Array.from(
        ballotID,
        byte => (`0${(byte & 0xFF).toString(16)}`).slice(-2),
      ).join('')}`;

      this.$router.push({
        path: '/',
        query: {
          id: ballotID,
        },
      });
    }
  },
  methods: {
    ...mapActions([
      'loadService',
      'deployService',
      'getBallotID',
    ]),
  },
}
</script>

<style lang="scss">
@import '~oasis-style/oasis.scss';

@font-face {
    font-family: 'Sul Sans';
    src: url('/assets/sulsans/Regular.woff2') format('woff2'),
        url('/assets/sulsans/Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}
@font-face {
    font-family: 'Sul Sans';
    src: url('/assets/sulsans/Bold.woff2') format('woff2'),
        url('/assets/sulsans/Bold.woff') format('woff');
    font-weight: bold;
    font-style: normal;
}
@font-face {
    font-family: 'Sul Sans';
    src: url('/assets/sulsans/Light.woff2') format('woff2'),
        url('/assets/sulsans/Light.woff') format('woff');
    font-weight: 300;
    font-style: normal;
}

#SecretBallot_App {
  background-color: $background-light-gray;
}

#SecretBallot_Footer {
  background-color: $background-light-gray;

  height: 140px !important;
}

#SecretBallot_FooterCard {
  background-color: $background-light-gray;
}

#SecretBallot_FooterLogo {
  height: 20px;
  width: 110px;

  position: relative;
  bottom: 20px;
}

#SecretBallot_FooterText {
  font-family: Sul Sans;
  font-size: 13px;
  line-height: 19px;

  color: #5B6872;
}

#SecretBallot_Toolbar {
  background-color: $background-light-gray;
  height: 120px;
}

#SecretBallot_ToolbarIcon {
  height: 40px;
  width: 32.5px;

  position: relative;
  top: 10px;
}

#SecretBallot_ToolbarText {
  font-family: Sul Sans;
  font-size: 20px;

  color: $oasis-red;
  text-transform: none;

  position: relative;
  left: 2.5%;
  top: 5%;
}
</style>
