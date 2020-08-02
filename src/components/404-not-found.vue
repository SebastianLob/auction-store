<template>
  <v-app>
    <v-main>
      <v-container class="fill-height">
        <v-row align='center' justify="center">
            <h1>Page not found. Redirecting to login...</h1>
            <h1>{{time}}</h1>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      time: 3
    }),
    created() {
      setInterval(
        () => (this.time--),
        1000
      );
      setTimeout(
        () => (this.$router.push('/login')),
        3000
      );
    }
  }
</script>