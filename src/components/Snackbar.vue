<template>
  <div class="snackbar-wrapper">
    <v-snackbar v-model="snackbar" :color="color" absolute>
      {{textToShow}}
      <template v-slot:action="{attrs}">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="$emit('closeSnackbar');"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    snackbar: true
  }),
  watch: {
    snackbar(val) {
      if (!val) {
        this.$emit('closeSnackbar');
      }
    }
  },
  props: {
    textToShow: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
}
</script>
<style scoped>
  .snackbar-wrapper {
    position: fixed;
    height: 100%;
    width: 100%;
    pointer-events: none;
    top: 0;
    left: 0;
    z-index: 1000;
  }
</style>
