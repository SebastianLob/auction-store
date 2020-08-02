<template>
  <v-app-bar fixed collapse-on-scroll color="white" dense>
      <v-toolbar-title class='font-weight-black headline ml-0'>
      <v-btn
          href='https://www.linkedin.com/in/sebastian-alejandro-lob-a4b87b167/'
          target='_blank'
          text
      >
          <span class='mr-2'>Sebastian Lob</span>
          <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
      </v-toolbar-title>
      <v-spacer/>
      <div class="text-center">
      <v-menu open-on-hover bottom offset-y>
          <template v-slot:activator="{on, attrs}">
          <v-btn
              color="secondary"
              dark
              v-bind="attrs"
              v-on="on"
          >
              {{username}}
          </v-btn>
          </template>
          <v-list>
          <v-list-item
              v-for="(item, index) in userOptions"
              :key="index"
              @click='doUserAction(item.action)'
          >
              <v-list-item-title>{{item.title}}</v-list-item-title>
          </v-list-item>
          </v-list>
      </v-menu>
      </div>
  </v-app-bar>
</template>

<script>
  import store from '@/store'

  export default {
    name: 'Logged-app-bar',
    data: () => ({
        username: '',
    }),
    created() {
      if (!store.getters.userIsLogged) {
        this.$router.push('login');
      }
      this.username = store.getters.username;
    },
    computed: {
      userOptions() {
        const items = [{title: 'Logout', action:'logout'}];
        if (this.username === 'admin') {
          items.unshift({title: 'Home', action:'home'});
          items.unshift({title: 'Admin Dashboard', action:'adminDashboard'});
        }
        return items;
      },
    },
    methods: {
      doUserAction(action) {
        this[action]();
      },
      logout() {
        if (this.$route.path !== '/login') {
          store.dispatch('logout').then(
            () => this.$router.replace({path: '/login'})
          );
        }
      },
      adminDashboard() {
        if (this.$route.path !== '/admin-dashboard') {
          this.$router.replace({path: '/admin-dashboard'})
        }
      },
      home() {
        if (this.$route.path !== '/home') {
          this.$router.replace({path: '/home'})
        }
      }
    }
  }
</script>
