<template>
  <v-card>
    <v-layout class="content align-center">
      <v-main>
        <v-container>
          <v-row>
            <v-spacer />
            <v-col
              cols="12"
              sm="8"
              lg="6"
              xl="4"
            >
              <slot />
            </v-col>
            <v-spacer />
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped lang="scss">
.content {
  min-height: 100vh;
}
</style>
