<template>
  <v-app>
    <Logged-app-bar/>
    <v-main>
      <v-container class="fill-width mt-12">
        <div>
          <flipCountdown deadline="2020-08-02 23:19:30" @timeElapsed='timeElapsed()'></flipCountdown>
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
                Show bids history
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

  export default {
    name: 'Details',
    components: {
      LoggedAppBar,
      FlipCountdown,
      BidHistory,
      Snackbar
    },
    data: () => ({
      snackbarColor: '',
      snackbarMessage: '',
      showSnackbar: false,
      bidPrice: '',
      showBidHistory: false,
      overlay: false,
      opacity: 0.75,
      auctionEnded: false,
      item: {
        id: 125,
        title: 'Article name',
        description: 'Article description made by the admin',
        imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        price: '18',
        bids: [
          {
            createdBy: 'user1',
            price: '6',
            dateTime: '2020/08/01 15:00'
          },
          {
            createdBy: 'user2',
            price: '8',
            dateTime: '2020/08/02 16:30'
          },
          {
            createdBy: 'user3',
            price: '15',
            dateTime: '2020/08/04 03:32'
          },
          {
            createdBy: 'user4',
            price: '18',
            dateTime: '2020/08/05 23:14'
          }
        ]
      }
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
      this.bidPrice = this.minimunPrice;
    },
    methods: {
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
          return `${year}/${month}/${day} ${hour}:${minutes}`;
      },
      submitBid() {
        if (this.validForm()) {
          const now = this.getStringDate();
          const newBid = {
            createdBy: store.getters.username,
            price: this.bidPrice,
            dateTime: now
          };
          this.showMessage('BID MADE! Great choice!', 'success');
          this.item.price = this.bidPrice;
          this.bidPrice = this.minimunPrice;
          this.item.bids.push(newBid);
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
