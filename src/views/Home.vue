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
                      <v-icon v-on="on">mdi-magnify</v-icon>
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
          :length="length"
          :next-icon="nextIcon"
          :prev-icon="prevIcon"
          :page="page"
          :total-visible="totalVisible"
          color="secondary"
        ></v-pagination>
      </div>
    </v-main>
  </v-app>
</template>

<script>
  import store from '@/store'
  import LoggedAppBar from '@/components/Logged-app-bar.vue'

  export default {
    name: 'Home',
    components: {
      LoggedAppBar
    },
    data: () => ({
      searchFilter: '',
      items: [
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '5'
        },
        {
          id: 125,
          title: 'Halcyon Days',
          description: 'Ellie Goulding',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
          price: '10'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '12'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '16'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        {
          id: 125,
          title: 'Supermodel',
          description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
          imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
          price: '18'
        },
        
      ],
        circle: false,
        disabled: false,
        nextIcon: 'mdi-chevron-right',
        prevIcon: 'mdi-chevron-left',
        page: 1,
        totalVisible: 10,
    }),
    created() {
      if (!store.getters.userIsLogged && this.$route.path !== '/login') {
        this.$router.push('login');
      }
    },
    computed: {
      userOptions() {
        const items = [{title: 'Logout', action:'logout'}];
        if (store.getters.username === 'admin') {
          items.unshift({title: 'Admin Dashboard', action:'adminDashboard'});
        }
        return items;
      },
      length() {
        const itemsSize = this.items.length;
        const pagesNumber = Math.ceil(itemsSize/10);
        return pagesNumber;
      },
      btnText() {
        return store.getters.username === 'admin'
          ? 'See details'
          : 'Bid now';
      }
    },
    methods: {
      orderByPrice() {
        this.$refs.priceOrderIcon.$el.classList.toggle('mdi-arrow-down');
        this.$refs.priceOrderIcon.$el.classList.toggle('mdi-arrow-up');
        // this.items.sort((a, b) => {
        //   const ascOrder = this.$refs.priceOrderIcon.$el.classList.contains('mdi-arrow-down');
        //   return ascOrder ? parseInt(a.price) - parseInt(b.price) : parseInt(b.price) - parseInt(a.price);
        // });
      },
      openDetails(id) {
        this.$router.push(`details/${id}`);
      }
    },
  };
</script>
