<template>
  <v-app>
    <Logged-app-bar/>
    <v-main>
      <v-form class="pb-0">
        <v-container class="mt-12">
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="searchFilter"
                outlined
                label="Name or description"
                color='secondary'
              >
                <template v-slot:append>
                  <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                      <v-icon :disabled='searching' @click='infoSearch()' v-on="on">mdi-magnify</v-icon>
                    </template>
                    Search
                  </v-tooltip>
                </template>
                <template v-slot:append-outer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{on}">
                      <v-icon v-on="on">mdi-currency-usd</v-icon>
                      <v-icon ref='priceOrderIcon' @click="orderByPrice()" v-on="on">mdi-arrow-down</v-icon>
                    </template>
                    Order by price
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
      <v-card class="mx-auto" elevation="0">
        <v-container>
          <v-row dense>
            <v-col v-for="(item, i) in items" :key="i">
              <v-card color="transparent" dark elevation="5">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div>
                    <v-card-title class="black--text">
                      {{item.title}}
                    </v-card-title>
                    <v-card-subtitle class="pb-0 black--text">
                      {{item.description}}
                    </v-card-subtitle>
                    <v-card-actions>
                      <v-btn color="transparent" elevation="5" class="black--text ml-2" @click='openDetails(item.id)'>
                        {{btnText}}
                      </v-btn>
                      <h2 class='ml-2 black--text'>
                        ${{item.price}}
                      </h2>
                    </v-card-actions>
                  </div>
                  <v-avatar class="ma-3" size="125" tile>
                    <v-img :src="item.imgSrc"></v-img>
                  </v-avatar>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :circle="circle"
          :disabled="disabled"
          :length="paginationLength"
          :next-icon="nextIcon"
          :prev-icon="prevIcon"
          :page="page"
          :total-visible="totalVisible"
          color="secondary"
        ></v-pagination>
      </div>
    </v-main>
    <Snackbar
      @closeSnackbar='showSnackbar = false'
      :textToShow='"Error. Try again later."'
      :color='"error"'
      v-if="showSnackbar"
    />
  </v-app>
</template>

<script>
  import store from '@/store'
  import LoggedAppBar from '@/components/Logged-app-bar.vue'
  import Snackbar from '@/components/Snackbar.vue'
  const axios = require('axios');

  export default {
    name: 'Home',
    components: {
      LoggedAppBar,
      Snackbar
    },
    data: () => ({
      searchFilter: '',
      items: [],
      circle: false,
      disabled: false,
      nextIcon: 'mdi-chevron-right',
      prevIcon: 'mdi-chevron-left',
      page: 1,
      totalVisible: 10,
      paginationLength: 1,
      infoFilter: false,
      searching: false,
      showSnackbar: false,
    }),
    created() {
      if (!store.getters.userIsLogged && this.$route.path !== '/login') {
        this.$router.push('login');
      }
      this.initialize();
    },
    computed: {
      btnText() {
        return store.getters.username === 'admin'
          ? 'See details'
          : 'Bid now';
      }
    },
    watch: {
      page(val) {
        const offset = (val-1)*10;
        this.getRecords(offset);
      },
    },
    methods: {
      infoSearch() {
        this.page = 1;
        this.searching = true;
        this.infoFilter = true;
        this.searchFilter = this.searchFilter.trim();
        let url = `/item?info=${this.searchFilter}&limit=10`;
        const orderByPriceDESC = this.$refs.priceOrderIcon.$el.classList.contains('mdi-arrow-up');
        if (orderByPriceDESC) {
          url = url + '&orderByPrice=DESC';
        }
        this.getRecords();
        this.setPaginationNumbers(true);
      },
      orderByPrice() {
        this.$refs.priceOrderIcon.$el.classList.toggle('mdi-arrow-down');
        this.$refs.priceOrderIcon.$el.classList.toggle('mdi-arrow-up');
        this.getRecords();
      },
      initialize() {
        this.setPaginationNumbers();
        this.getRecords(0, false);
      },
      getRecords(offset = 0, validateLimit = true) {
        this.searching = true;
        let url = '/item?limit=10'+ '&offset=' + offset;
        if (this.infoFilter) {
          url = url + '&info=' + this.searchFilter;
        }
        if (validateLimit) {
          const orderByPriceDESC = this.$refs.priceOrderIcon.$el.classList.contains('mdi-arrow-up');
          if (orderByPriceDESC) {
            url = url + '&orderByPrice=DESC';
          }
        }
        axios.get(url).then((response) => {
          this.items = response.data;
        }).catch((error) => {
          this.showSnackbar = true;
        }).finally(() => {
          this.searching = false;
        });
      },
      setPaginationNumbers(infoSearching = false) {
        let url = '/item';
        if (infoSearching) {
          url = url +'?info=' + this.searchFilter.trim();
        }
        axios.get(url).then((response) => {
          const itemsSize = response.data.length;
          const pagesNumber = Math.ceil(itemsSize/10);
          this.paginationLength = pagesNumber === 0 ? 1 : pagesNumber;
        }).catch((error) => {
          this.showSnackbar = true;
        });
      },
      openDetails(id) {
        this.$router.push(`details/${id}`);
      }
    },
  };
</script>
