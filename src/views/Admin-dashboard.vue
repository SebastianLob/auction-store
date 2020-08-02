<template>
  <v-app>
    <Logged-app-bar/>
    <v-main>
      <v-container class="fill-height">
        <h1>
          Aca va a ir el admin dashboard
        </h1>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  import store from '@/store'
  import LoggedAppBar from '@/components/Logged-app-bar.vue'

  export default {
    name: 'Admin-dashboard',
    components: {
      LoggedAppBar
    },
    data: () => ({
    }),
    created() {
      
    }
  }
</script>