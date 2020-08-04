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
                        <input ref='fileUploader' type="file" accept="image/jpeg" @change='uploadImage($event)' class='mb-2'>
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
      </v-data-table>
    </v-main>
    <Snackbar
      @closeSnackbar='showSnackbar = false'
      :textToShow='snackbarMessage'
      :color='snackbarColor'
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
    name: 'Admin-dashboard',
    components: {
      LoggedAppBar,
      Snackbar
    },
    data: () => ({
      snackbarMessage: '',
      snackbarColor: '',
      showSnackbar: false,
      menu2: false,
      previewImage: false,
      previewImageUrl: null,
      time: null,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      dialog: false,
      headers: [
        {text: 'Title', align: 'start', value: 'title'},
        {text: 'Description', value: 'description'},
        {text: 'Image', value: 'imgSrc', sortable: false},
        {text: 'Auction endtime', value: 'auctionEndDateTime'},
        {text: 'Actions', value: 'actions', sortable: false},
      ],
      items: [],
      editedIndex: -1,
      editedItem: {
        id: null,
        title: '',
        description: '',
        imgSrc: '',
        auctionEndDate: '',
        auctionEndDateTime: ''
      },
      defaultItem: {
        id: null,
        title: '',
        description: '',
        imgSrc: '',
        auctionEndDate: '',
        auctionEndDateTime: ''
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
          reader.onload = e => {
            this.previewImageUrl = e.target.result;
            this.previewImage = true;
          };
      },
      getItems() {
        axios.get('/item').then((response) => {
          this.items = response.data;
        }).catch((error) => {
          this.showSnackbar = true;
        });
      },
      initialize () {
        this.getItems();
      },
      editItem (item) {
        this.editedIndex = this.items.indexOf(item);
        this.date = item.auctionEndDateTime.slice(0, 10);
        this.time = item.auctionEndDateTime.slice(11, 16);
        this.editedItem = Object.assign({}, item);
        this.dialog = true;
      },
      deleteItem (item) {
        const params = new URLSearchParams();
          params.append('id', item.id);
          params.append('_delete', '_delete');
          axios.post('/item', params).then((response) => {
            this.showMessage('Item deleted!', 'success');
          }).catch((error) => {
            this.showMessage('Error. Try again later.', 'error');
          });
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
      showMessage(messageToShow, messageType) {
        this.snackbarMessage = messageToShow;
        this.snackbarColor = messageType;
        this.showSnackbar = true;
      },
      validForm() {
        if (this.editedItem.title.trim() === '') {
          this.showMessage('Please, provide a title.', 'error');
          return false;
        }
        if (this.editedItem.description.trim() === '') {
          this.showMessage('Please, provide a description.', 'error');
          return false;
        }
        if (
          (this.$refs.fileUploader.files.length === 0) && (this.editedItem.id === null)
        ) {
          this.showMessage('Please, select a image.', 'error');
          return false;
        }
        if (this.date.trim() === '') {
          this.showMessage('Please, provide a auction date.', 'error');
          return false;
        }
        if (this.time.trim() === '') {
          this.showMessage('Please, provide a auction time.', 'error');
          return false;
        }
        return true;
      },
      createFormData() {
        let formData = new FormData();
        formData.append('file', this.$refs.fileUploader.files[0]);
        formData.append('title', this.editedItem.title);
        formData.append('description', this.editedItem.description);
        formData.append('auctionEndDateTime', this.date + ' ' + this.time);
        return formData;
      },
      makePost(formData) {
        axios.post('/item', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.showMessage('Item updated!', 'success');
          this.getItems();
          this.previewImage = false;
        }).catch((error) => {
          this.showMessage('Error. Try again later.', 'error');
        });
      },
      save () {
        if (this.validForm()) {
          if (this.editedIndex > -1) {
            this.editedItem.auctionEndDateTime = this.date +  ' ' + this.time;
            let formData = this.createFormData();
            formData.append('id', this.editedItem.id);
            formData.append('_put', '_put');
            this.makePost(formData);
            Object.assign(this.items[this.editedIndex], this.editedItem);
          } else {
            let formData = this.createFormData();
            this.makePost(formData);
          }
          this.close();
        }
      },
    },
  }
</script>

<style scoped>
  .image {
    max-width: 12rem;
  }
</style>
