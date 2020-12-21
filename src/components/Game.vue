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
                  v-if="rolesAreAsigned"
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
            <h1 id="title" :class="{ animation: animateTitle }">MAFIA</h1>
            <component :is="timer"><Timer /></component>
            <h2 class="roleText" v-if="rolesAreAsigned">
              You are <span class="role">{{ myRole }}</span>
            </h2>
            <i v-if="night" class="fas fa-moon"></i>
            <i v-if="day" class="fas fa-sun"></i>
            <v-text-field
              v-if="!playerJoined"
              placeholder="Enter your nickname..."
              counter
              maxlength="10"
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
              <v-col sm="6">
                <span class="playersTitle">Voter</span>
                <v-divider dark></v-divider>
                <ul class="players">
                  <li v-for="name in voters" :key="name.id" class="player">
                    {{ name }}
                  </li>
                </ul>
              </v-col>
              <v-col sm="6">
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
        {{ snackText }}
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
/* eslint-disable */
import Timer from "@/components/Timer.vue";

export default {
  data: function () {
    return {
      player: {
        name: "",
        role: "",
        voteIcon: "",
      },
      games: [
        {
          img: "link.com",
          video: "",
          info: "asdasdasdasdasdasd",
          infos: {
            title: "",
            desc: "",
          },
        },
      ],

      myName: "",
      myRole: "KILLER",
      animateTitle: false,
      playerJoined: false,
      timer: "",
      permision: true,
      snackbar: false,
      snackText: "",
      rolesAreAsigned: false,
      night: false,
      day: false,
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
      voters: ["Vasile"],
      targets: [
        {
          name: "Ion",
        },
      ],
    };
  },
  components: {
    Timer,
  },
  methods: {
    addPlayer(player) {
      this.myName = player.name;
      console.log(this.myName);
      this.localPlayers.push(player);
      this.animateTitle = true;
      this.playerJoined = true;
      setTimeout(() => {
        this.timer = "Timer";
      }, 2000);
      setTimeout(() => {
        this.rolesAreAsigned = true; /// temporar
        this.night = true;
        setInterval(() => {
          this.night = !this.night;
          this.day = !this.day;
        }, 2000);
      }, 4000);
    },
    vote(index) {
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
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Special+Elite&display=swap");

.fa-moon {
  color: rgb(255, 217, 0);
  font-size: 15rem;
  margin-top: 7vh;
}
.fa-sun {
  color: rgb(255, 217, 0);
  font-size: 15rem;
  margin-top: 7vh;
}

.roleText {
  letter-spacing: 0.5rem;
  font-size: 1.5rem;
  font-family: "Special Elite";
}
.role {
  color: RGB(102, 2, 0);
  font-size: 1.5rem;
  filter: brightness(250%);
}

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
  filter: brightness(225%);
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
  overflow-y: auto;
  overflow-x: hidden;
}
.playersCard::-webkit-scrollbar {
  width: 0.5rem;
}
.playersCard::-webkit-scrollbar-track {
  background: grey;
}
.playersCard::-webkit-scrollbar-thumb {
  background: rgb(26, 26, 26);
}

.playersTitle {
  font-size: 2.2rem;
  color: rgb(236, 224, 46);
  padding: 0.5rem;
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
