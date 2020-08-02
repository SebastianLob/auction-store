<template>
  <v-snackbar v-model="snackbar" :color="color">
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