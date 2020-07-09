<template>
    <v-layout row wrap>
        <v-flex xs4>
            <v-btn color="primary" @click="prevStep">
                Previous
            </v-btn>
        </v-flex>

        <v-flex xs4>
            <v-btn color="primary" @click="nextStep">
                Next
            </v-btn>
        </v-flex>

        <v-flex xs4>
            <v-btn color="primary" @click="modifyWorkflows">
                Modify Existing Workflow
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script>

  export default {
      data () {
          return {
          }
      },

      props: ['controls'],

      methods: {
          prevStep() {
              this.$emit('prevStep');
          },

          nextStep() {
              this.$emit('nextStep');
          },

          modifyWorkflows() {
              this.$emit('modifyWorkflows');
          },
      },
  }
</script>

<style lang="scss" scoped>

</style>
