<template>
  <v-app>
    <v-main>
      <Game />
    </v-main>
  </v-app>
</template>

<script>
import Game from "@/components/Game.vue";
export default {
  name: "App",
  components: {
    Game,
  },

  data: () => ({
    //
  })
};
</script>

<style>
html{
  overflow: auto;
}

</style>
