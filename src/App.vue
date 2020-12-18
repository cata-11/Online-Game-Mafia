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

<style scoped>
*{
  margin: 0;
}

</style>
