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
          The Secret Ballot app lets you share a poll with friends or coworkers <br />
          and ensures votes are kept private, even from the vote maker!
        </div>
      </v-card-text>

      <v-card-actions class="pl-3 pt-4">
        <v-btn
          id="Welcome_Button"
          :loading="!ballot"
          @click="$router.push({ name: 'vote', query: $route.query })"
        >
          Participate in vote
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
  height: 38px;
  width: 193px;

  background-color: $bright-blue;
  border-radius: 3px;
  color: $light-gray;

  font-family: Sul Sans;
  font-size: 15px;
  font-weight: bold;
  text-transform: none;
  line-height: 18px;

  -webkit-box-shadow: none;
	-moz-box-shadow: none;
	box-shadow: none;
}

#Welcome_Card {
  background-color: $background-light-gray;

  display: block;
  margin-left: auto;
  margin-right: auto;
}

#Welcome_Container {
  position: relative;
  top: 25vh;
}

#Welcome_Description {
  font-family: Sul Sans;
  font-size: 17px;
  font-weight: 300;
  line-height: 27px;

  color: #5b6872;
  letter-spacing: -0.377778px;
}

#Welcome_Title {
  font-family: Sul Sans;
  font-size: 22px;

  letter-spacing: -0.488889px;
}
</style>
