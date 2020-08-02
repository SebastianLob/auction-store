<template>
  <v-app>
    <Logged-app-bar/>
    <v-main>
      <v-data-table
        :headers="headers"
        :items="items"
        sort-by="calories"
        class="elevation-1 mt-12"
      >
        <template v-slot:item.imgSrc="{ item }">
          <v-img aspect-ratio="1" class='ma-1' min-width="40" :src="item.imgSrc"></v-img>
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Edit items</v-toolbar-title>
            <v-divider class="mx-4" inset vertical/>
            <v-spacer/>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="secondary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                  @click='cleanForm'
                >
                  New Item
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{formTitle}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.title" label="Title" color='secondary'></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          color='secondary'
                          outlined
                          label="Description"
                          :value="editedItem.description"
                          v-model="editedItem.description"
                        ></v-textarea>
                      </v-col>
                      <v-col cols="12">
                        <h3 class='mb-2'>Image:</h3>
                        <img :src="editedItem.imgSrc" class="image" v-if="!previewImage"/>
                        <img :src="previewImageUrl" class="image" v-if="previewImage"/>
                        <input type="file" accept="image/jpeg" @change='uploadImage($event)' class='mb-2'>
                      </v-col>
                      <v-col cols="12">
                        <v-menu
                          ref="dateMenu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :return-value.sync="date"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="date"
                              label="Auction end date"
                              prepend-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              color="secondary"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date"
                            no-title
                            scrollable
                            color="secondary"
                          >
                            <v-spacer/>
                            <v-btn text color="secondary" @click="menu = false">Cancel</v-btn>
                            <v-btn text color="secondary" @click="$refs.dateMenu.save(date)">OK</v-btn>
                          </v-date-picker>
                        </v-menu>
                        <v-menu
                          ref="menu"
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="time"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="time"
                              label="Auction end time"
                              prepend-icon="mdi-clock"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              color="secondary"
                            ></v-text-field>
                          </template>
                          <v-time-picker
                            v-if="menu2"
                            v-model="time"
                            full-width
                            color="secondary"
                          >
                            <v-spacer/>
                            <v-btn text color="secondary" @click="menu2 = false">Cancel</v-btn>
                            <v-btn text color="secondary" @click="$refs.menu.save(time)">OK</v-btn>
                          </v-time-picker>
                        </v-menu>
                      </v-col>                      
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
      </v-data-table>
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
      menu2: false,
      previewImage: false,
      previewImageUrl: null,
      time: null,
      timeMenu: false,
      modal2: false,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      modal: false,
      dialog: false,
      headers: [
        {text: 'Title', align: 'start', value: 'title'},
        {text: 'Description', value: 'description'},
        {text: 'Image', value: 'imgSrc'},
        {text: 'Auction endtime', value: 'auctionEndTime'},
        {text: 'Actions', value: 'actions', sortable: false},
      ],
      desserts: [],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        title: '',
        description: '',
        imgSrc: '',
        auctionEndDate: '',
        auctionEndTime: ''
      },
      defaultItem: {
        id: null,
        title: '',
        description: '',
        imgSrc: '',
        auctionEndDate: '',
        auctionEndTime: ''
      },
    }),
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item';
      },
    },
    watch: {
      dialog (val) {
        val || this.close();
      },
    },
    created () {
      if (!store.getters.userIsLogged && this.$route.path !== '/login') {
        this.$router.push('login');
      }
      this.initialize();
    },
    methods: {
      cleanForm() {
        this.time = '';
        this.date = '';
      },
      uploadImage(e){
          const image = e.target.files[0];
          const reader = new FileReader();
          reader.readAsDataURL(image);
          reader.onload = e =>{
            this.previewImageUrl = e.target.result;
            this.previewImage = true;
          };
      },
      initialize () {
        this.items = [
          {
            id: 100,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 101,
            title: 'Halcyon Days',
            description: 'Ellie Goulding',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 103,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 105,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 107,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 110,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 126,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 127,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 128,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 129,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 130,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 131,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 132,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 133,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 134,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 135,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 137,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 138,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
          {
            id: 140,
            title: 'Supermodel',
            description: 'Foster the People asdasdasdasd asd asd s asdsasdasda',
            imgSrc: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
            auctionEndTime: '2020-08-05 15:30'
          },
        ]
      },
      editItem (item) {
        this.editedIndex = this.items.indexOf(item);
        this.date = item.auctionEndTime.slice(0, 10);
        this.time = item.auctionEndTime.slice(11, 16);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem (item) {
        const index = this.items.indexOf(item);
        confirm('Are you sure you want to delete this item?') && this.items.splice(index, 1);
      },
      close () {
        this.dialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },
      save () {
        if (this.editedIndex > -1) {
          this.editedItem.auctionEndTime = this.date +  ' ' + this.time;
          Object.assign(this.items[this.editedIndex], this.editedItem);
        } else {
          this.items.push(this.editedItem);
        }
        this.close();
      },
    },
  }
</script>

<style scoped>
  .image {
    max-width: 12rem;
  }
</style>
