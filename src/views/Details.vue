<template>
  <v-app>
    <Logged-app-bar/>
    <v-main>
      <v-container class="fill-width mt-12">
        <div>
          <flipCountdown v-if='createClock' :deadline="auctionEndDateTime" @timeElapsed='timeElapsed()'></flipCountdown>
        </div>
        <v-card class="mx-auto" max-width="600">
          <v-img
            class="white--text align-end"
            height="200px"
            :src="item.imgSrc"
          >
            <v-card-title>{{item.title}}</v-card-title>
          </v-img>
          <v-card-subtitle class="pb-0">{{item.description}}</v-card-subtitle>
          <v-card-text class="headline mb-1" v-if='item.price !== ""'>
            <h2 class='mt-2'>
              ${{item.price}} <span style='font-size: large; font-style: italic;'>(Last bid)</span>
            </h2>
          </v-card-text>
          <v-card-actions>
            <v-row align='center' justify="center">
              <v-col cols="12">
                <v-text-field
                  label="Amount"
                  append-outer-icon="mdi-cash-usd"
                  v-model="bidPrice"
                  prefix="$"
                  type='number'
                  :min='minimunPrice'
                  color='secondary'
                  outlined
                  v-if="!auctionEnded"
                ></v-text-field>
              </v-col>
              <v-btn color="secondary" class="ma-2 white--text" outlined v-if="!auctionEnded" @click='submitBid()'>
                Submit Bid
                <v-icon right>mdi-cart-outline</v-icon>
              </v-btn>
              <v-btn color="secondary" class="ma-2 white--text" outlined @click='showBidHistory = true'>
                Show bid history
                <v-icon right>mdi-history</v-icon>
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-main>
    <div class="text-center">
      <v-overlay :value="overlay" :opacity="opacity">
        <h1>Auction ended. You can still looking at the bid history.</h1>
        <v-btn icon @click="overlay = false">
          Close
        </v-btn>
      </v-overlay>
    </div>
    <Bid-history
      v-if='showBidHistory'
      :bids='item.bids'
      @closeDialog='closeBidHistory'
    />
    <Snackbar
      @closeSnackbar='showSnackbar = false'
      :textToShow='snackbarMessage'
      :color='snackbarColor'
      v-if="showSnackbar"
    />
  </v-app>
</template>

<script>
  import LoggedAppBar from '@/components/Logged-app-bar.vue'
  import FlipCountdown from '@/components/FlipCountdown.vue'
  import BidHistory from '@/components/Bid-history.vue'
  import Snackbar from '@/components/Snackbar.vue'
  import store from '@/store'
  const axios = require('axios');

  export default {
    name: 'Details',
    components: {
      LoggedAppBar,
      FlipCountdown,
      BidHistory,
      Snackbar
    },
    data: () => ({
      createClock: false,
      auctionEndDateTime: '',
      snackbarColor: '',
      snackbarMessage: '',
      showSnackbar: false,
      bidPrice: 0,
      showBidHistory: false,
      overlay: false,
      opacity: 0.75,
      auctionEnded: false,
      item: {}
    }),
    props: ['id'],
    created() {
      if (!store.getters.userIsLogged && this.$route.path !== '/login') {
        store.dispatch('logout').then(
          () => this.$router.replace({path: '/login'})
        );
      }
      if (store.getters.username === 'admin') {
        this.auctionEnded = true;
      }
      this.initialize();
    },
    methods: {
      initialize() {
        this.getItemInfo();
      },
      getItemInfo() {
        axios.get(`item?id=${this.id}`).then((response) => {
          this.item = response.data[0];
          if (this.item.auctionEndDateTime <= this.getStringDate()) {
            this.auctionEnded = true;
          }
          this.getItemBids();
          this.auctionEndDateTime = this.item.auctionEndDateTime;
          this.createClock = true;
        }).catch((error) => {
          this.showMessage('Error. Try again later.', 'error');
        });
      },
      getItemBids() {
        axios.get(`bid?itemId=${this.id}`).then((response) => {
          this.item.bids = response.data;
          this.bidPrice = this.minimunPrice;
        }).catch((error) => {
          this.showMessage('Error. Try again later.', 'error');
        });
      },
      closeBidHistory() {
        this.showBidHistory = false;
      },
      timeElapsed() {
        this.auctionEnded = true;
        this.overlay = true;
      },
      getStringDate() {
          const now = new Date();
          const year = now.getFullYear();
          let month = now.getMonth() + 1;
          month = ('0' + month).slice(-2);
          let day = now.getDate();
          day = ('0' + day).slice(-2);
          let hour = now.getHours();
          hour = ('0' + hour).slice(-2);
          let minutes = now.getMinutes();
          minutes = ('0' + minutes).slice(-2);
          let seconds = now.getSeconds();
          seconds = ('0' + seconds).slice(-2);
          return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
      },
      submitBid() {
        if (this.validForm()) {
          const now = this.getStringDate();
          const params = new URLSearchParams();
          params.append('createdBy', store.getters.username);
          params.append('price', this.bidPrice);
          params.append('createdAt', now);
          params.append('itemId', this.id);
          axios.post('/bid', params).then((response) => {
            this.item.bids.push({
              createdBy: store.getters.username,
              price: this.bidPrice,
              createdAt: now,
              itemId: this.id
            });
            this.item.price = this.bidPrice;
            this.bidPrice++;
            this.showMessage('BID MADE! Great choice!', 'success');
          }).catch((error) => {
            this.showMessage('Error. Try again later.', 'error');
          });
        }
      },
      validForm() {
        if (parseFloat(this.bidPrice) < parseFloat(this.item.price) + 1) {
          this.showMessage('The amount must be at least $1 higher than the last offer.', 'error');
          return false;
        }
        return true;
      },
      showMessage(messageToShow, messageType) {
        this.snackbarMessage = messageToShow;
        this.snackbarColor = messageType;
        this.showSnackbar = true;
      }
    },
    computed: {
      minimunPrice() {
        return parseFloat(this.item.price) + 1;
      }
    }
  }
</script>
