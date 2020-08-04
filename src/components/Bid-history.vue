<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="800">
      <v-card>
        <v-card-title class="black--text headline">
          Bid history
        </v-card-title>
        <v-card-text>
          <v-timeline dense>
            <v-timeline-item color='secondary' v-for="(bid, index) in bids" v-bind:key="index" :icon="'mdi-currency-usd'">
              <v-card>
                <v-card-title class="black--text">
                  ${{bid.price}}
                </v-card-title>
                <v-card-text>
                  <span style="font-weight: bold;">{{bid.createdAt}}hs</span> - <span style="font-style: italic;">{{bid.createdBy}}</span>
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="secondary" text @click="closeDialog()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
  export default {
    name: 'Bid-history',
    data: () => ({
      dialog: true,
    }),
    props: {
      bids: {
        type: Array,
        required: true
      }
    },
    methods: {
      closeDialog() {
        this.$emit('closeDialog');
        this.dialog = false;
      }
    }
  }
</script>
