<template>
  <v-app id="intro">
    <v-container fluid>
      <v-row id="input">
        <!--Players-->
        <v-col sm="4" class="align">
          <div class="playersCard">
            <span class="playersTitle"> Alive players </span>
            <v-divider dark></v-divider>

            <ul class="players">
              <li
                v-for="(player, index) in localPlayers"
                :key="player.id"
                class="player"
              >
                {{ player.name }}
                <v-btn
                  class="voteBtn"
                  @click="vote(index)"
                  :color="localPlayers[index].voteIcon"
                  elevation="5"
                  icon
                  dark
                >
                  <v-icon> mdi-vote </v-icon>
                </v-btn>
              </li>
            </ul>
          </div>
        </v-col>
        <!--End Players-->

        <!--Middle-->
        <v-col sm="4">
          <div>
            <h1 id="title" :class="{ animation: animate }">MAFIA</h1>
            <component :is="timer"><Timer /></component>
            <v-text-field
              v-if="!playerJoined"
              placeholder="Enter your nickname..."
              dark
              append-icon="mdi-plus"
              autofocus
              v-model="player.name"
              @click:append="addPlayer(player)"
            ></v-text-field>
          </div>
        </v-col>
        <!--End Middle-->

        <!--Votes -->
        <v-col sm="4" class="align">
          <div class="playersCard">
            <v-row>
              <v-col>
                <span class="playersTitle">Voter</span>
                <v-divider dark></v-divider>
                <ul class="players">
                  <li v-for="vote in voters" :key="vote.id" class="player">
                    {{ vote }}
                  </li>
                </ul>
              </v-col>
              <v-col>
                <span class="playersTitle">Target</span>
                <v-divider dark></v-divider>
                <ul class="players">
                  <li v-for="target in targets" :key="target.id" class="player">
                    {{ target.name }}
                  </li>
                </ul>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <!--End Votes -->
      </v-row>
      <v-snackbar v-model="snackbar" timeout="2000">
        {{ this.snackText }}
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-container>
  </v-app>
</template>

<script>
import Timer from "@/components/Timer.vue";
import vueScrollbar from "vue-scrollbar";

export default {
  data: function () {
    return {
      player: {
        name: "",
        role: "",
        voteIcon: "",
      },
      myName: "",
      animate: false,
      playerJoined: false,
      timer: "",
      permision: true,
      snackbar: false,
      snackText: "",

      localPlayers: [
        {
          name: "John",
          role: "",
          votes: 0,
          voteIcon: "",
        },
        {
          name: "SantaClaus",
          role: "",
          votes: 0,
          voteIcon: "",
        },
        {
          name: "Arnold",
          role: "",
          votes: 0,
          voteIcon: "",
        },
      ],
      voters: [],
      targets: [],
    };
  },
  components: {
    Timer,
    vueScrollbar,
  },
  methods: {
    addPlayer(player) {
      this.myName = player.name;
      console.log(this.myName);
      this.localPlayers.push(player);
      this.animate = true;
      this.playerJoined = true;
      setTimeout(() => {
        this.timer = "Timer";
      }, 2000);
      //console.log(this.$store.state.players);
    },
    vote(index) {
      //console.log(index);
      if (this.permision == true && this.myName) {
        this.localPlayers[index].voteIcon = "green";
        this.localPlayers[index].votes++;
        this.targets.push(this.localPlayers[index]);
        this.voters.push(this.myName);
        this.permision = false;
      } else {
        if (!this.myName) {
          this.snackText = "You can't vote !";
          this.snackbar = true;
        } else if (this.myName) {
          this.snackText = "Your vote has been submitted already !";
          this.snackbar = true;
        }
      }
      /*
      if (this.localPlayers[index].voteIcon == "green") {
        this.localPlayers[index].voteIcon = "";
        this.targets.splice(index, 1);
        this.voters.splice(index, 1);
      } else {
        this.localPlayers[index].voteIcon = "green";
        this.targets.push(this.localPlayers[index].name);
        this.voters.push(this.myName);
      }
      for (let i = 0; i < this.localPlayers.length; i++)
        if (this.localPlayers[i].voteIcon == "green" && i != index)
          this.localPlayers[i].voteIcon = "";

      for (let i = 0; i < this.localPlayers.length; i++)
        if (this.localPlayers[i].voteIcon == "green") {
          this.targets.push(this.localPlayers[i]);
        }
        */
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
.players {
  text-decoration: none;
  list-style: none;
  display: flex;
  flex-direction: column;
}
.player {
  font-size: 1.5rem;
  color: white;
  margin: 0.4rem 0.5rem;
  display: flex;
  justify-content: space-between;
}
.voteBtn {
  margin: 0 0.5rem;
}

#title {
  margin: 10rem 0 0 0;
  letter-spacing: 0.8rem;
  font-size: 5rem;
  font-family: "Special Elite", cursive;
  color: RGB(102, 2, 0);
  filter: brightness(200%);
}
#roleText {
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
