<template>
  <v-app id="intro">
    <v-container fluid>
      <v-row id="input">
        <!--Players-->
        <v-col sm="4" class="align">
          <div class="playersCard">
            <span class="playersTitle"> Alive players </span>

            <v-virtual-scroll
              :items="this.$store.state.players"
              :item-height="50"
              height="10000"
            >
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-title class="playerName">
                    {{ item }}
                  </v-list-item-title>
                </v-list-item>
              </template>
            </v-virtual-scroll>
            
          </div>
        </v-col>
        <!--End Players-->

        <!--Middle-->
        <v-col sm="4">

          <div class="d-flex flex-column justify-space-between" style="height: 100%">

            <div>
              <h1 id="title" :class="{ animation: animate }">MAFIA</h1>
              <component :is="timer"><Timer /></component>
              
              <v-text-field v-if="!gameStarted"
                placeholder="Enter your nickname..."
                dark
                append-icon="mdi-plus"
                autofocus
                v-model="nickname"
                @click:append="addPlayer(nickname)"
              ></v-text-field>
            </div>

            <div v-if="gameStarted" class="d-flex flex-column">
              <h1 id="roleText">Your role is, therefore now you ought to vote</h1>

              <v-select 
                :items="players"
                item-text="name"
                outlined 
                dark
                label="Player Name"
              ></v-select>

              <v-btn
                outlined
                x-large
                color="red"
              >
                VOTE
              </v-btn>
            </div>
          </div>

        </v-col>
        <!--End Middle-->

        <!--Votes -->
        <v-col sm="4" class="align">
          <div class="votesCard">
            <div class="votesTitles">
              <span class="playersTitle"> Voter </span>

              <span class="playersTitle"> Target </span>
            </div>

            <v-virtual-scroll
              :items="this.$store.state.players"
              :item-height="50"
              height="10000"
            >
              <template v-slot:default="{ item }">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="playerName">
                      {{ item }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-content>
                    <v-list-item-title class="playerName">
                      {{ item }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </div>
        </v-col>
        <!--End Votes -->
      </v-row>
    </v-container>

    <v-snackbar v-model="welcome">
      Welcome {{ temp }}
      <template v-slot:action="{ attrs }">
        <v-btn dark color="red" text v-bind="attrs"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import Timer from "@/components/Timer.vue";
export default {
  data: function () {
    return {
      nickname: "",
      temp: "",
      animate: false,
      gameStarted: false,
      timer: "",
      players: [
        {name: "Gica", value:"1"},
        {name: "Costica", value:"2"},
      ]
    };
  },
  components: {
    Timer,
  },
  methods: {
    addPlayer(nick) {
      this.$store.state.players.push(nick);
      this.temp = this.nickname;
      this.nickname = "";
      this.animate = true;
      this.hide = true;
      this.gameStarted = true;
      setTimeout(() => {
        this.timer = "Timer";
      }, 2000);
      //console.log(this.$store.state.players);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");

#intro {
  background-image: url("https://cdn.wallpapersafari.com/87/97/nOthRF.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100vh;
}
#input {
  font-size: 10rem;
  color: white;
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 0;
}
.align {
  display: flex;
  justify-content: center;
  text-align: center;
}
#title {
  margin: 10rem 0 0 0;
  letter-spacing: 0.8rem;
  font-size: 5rem;
  font-family: "Special Elite", cursive;
  color: RGB(102, 2, 0);
  filter: brightness(200%);
}
#roleText
{
  font-size: 1.5rem;
  font-family: "Special Elite", cursive;
  color: RGB(102, 2, 0);
  filter: brightness(200%);
  margin-bottom: 15px;
}
@keyframes anime {
  from {
    margin: 10rem 0 0 0;
  }
  to {
    margin: 0;
  }
}
.animation {
  animation-name: anime;
  animation-duration: 2s;
  animation-fill-mode: forwards;
}
@keyframes show {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    pointer-events: none;
  }
}
.disapear {
  animation-name: show;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}
.playersCard {
  background: rgba(215, 211, 226, 0.2);
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 80vh;
  margin: 3rem 0 0 0;
  border-radius: 1%;
}
.playersTitle {
  font-size: 2.2rem;
  color: rgb(236, 224, 46);
  padding: 0.5rem;
}
.playerName {
  color: white;
  font-size: 1.7rem;
}
.votesCard {
  background: rgba(215, 211, 226, 0.2);
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 80vh;
  margin: 3rem 0 0 0;
  border-radius: 1%;
}
.votesTitles {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
