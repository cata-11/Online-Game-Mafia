<template>
  <v-app>
    <v-main>
      <Intro />
    </v-main>
  </v-app>
</template>

<script>
import Intro from "@/components/Intro.vue";
export default {
  name: "App",
  components: {
    Intro,
  },

  data: () => ({
    //
  })
};
</script>

<style>
*{
  margin: 0;
  box-sizing: border-box;
}

</style>
