<template>
  <v-container id="Welcome_Container" fill-height>
    <v-card
      id="Welcome_Card"
      flat
    >
      <v-card-text>
        <div id="Welcome_Title">
          Hi, Welcome to <b>Secret Ballot APP</b>
        </div>
        <div id="Welcome_Description" class="pt-3">
          The Secret Ballot app lets you share a poll with friends or coworkers
          and ensures votes are kept private, even from the vote maker!
        </div>
      </v-card-text>

      <v-card-actions class="pl-3 pt-4">
        <v-btn
          id="Welcome_Button"
          :loading="!ballot"
          @click="$router.push({ name: 'vote', query: $route.query })"
        >
          <img
            id="Welcome_VoteIcon"
            src="/assets/SecretBallot_vote.svg"
          >
          <span class="pl-2">
            Participate in vote
          </span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Welcome',
  computed: {
    ...mapState([
      'ballot',
    ]),
  },
};
</script>

<style scoped lang="scss">
@import '~oasis-style/oasis.scss';

#Welcome_Button {
  @extend .o-btn-primary;
  width: 193px;
}

#Welcome_Card {
  background-color: $background-light-gray;

  display: block;
  margin-left: auto;
  margin-right: auto;
}

#Welcome_Container {
  position: relative;
  top: 20vh;
}

#Welcome_Description {
  font-family: Sul Sans;
  font-size: 17px;
  font-weight: 300;
  line-height: 27px;

  max-width: 525px;

  color: #5b6872;
  letter-spacing: -0.377778px;
}

#Welcome_Title {
  font-family: Sul Sans;
  font-size: 22px;

  letter-spacing: -0.488889px;
}

#Welcome_VoteIcon {
  height: 22px;
  width: 20px;

  color: white;
}
</style>
