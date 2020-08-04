<template>
  <v-app>
    <Login-app-bar/>
    <v-main>
      <v-container class="fill-height">
        <v-row align='center' justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="elevation-12">
              <v-toolbar color="secondary" dark flat>
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer/>
              </v-toolbar>
              <v-card-text class='pb-0'>
                <v-form ref="form" v-model="valid">
                  <v-text-field
                    label="Username"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    color="secondary"
                    v-model="username"
                    :rules='usernameRules'
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    color="secondary"
                    v-model="password"
                    :rules='passwordRules'
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="secondary" :disabled="!valid" @click="log" @keyup.enter="log">
                  Login
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
    <Snackbar
      @closeSnackbar='showSnackbar = false'
      :textToShow='"Invalid username or password. Please try again."'
      :color='"error"'
      v-if="showSnackbar"
    />
  </v-app>
</template>

<script>
  import API from '@/components/API.vue'
  import store from '@/store'
  import LoginAppBar from '@/components/Login-app-bar.vue'
  import Snackbar from '@/components/Snackbar.vue'

  export default {
    components: {
      LoginAppBar,
      Snackbar
    },
    data: () => ({
      valid: false,
      username: '',
      password: '',
      usernameRules: [input => !!input || 'Username is required'],
      passwordRules: [input => !!input || 'Password is required'],
      showSnackbar: false
    }),
    methods: {
      log() {
        const validLoggin = API.log(this.username, this.password);
        if (validLoggin) {
          store.dispatch('logUser', this.username);
          this.$router.push('home');
          return;
        }
        this.showSnackbar = true;
      }
    },
  }
</script>
