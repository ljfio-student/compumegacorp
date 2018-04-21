<template>
  <div class="home">
    <greeting v-if="!loggedIn" />
    <dashboard v-if="loggedIn" />
  </div>
</template>

<script>
// @ is an alias to /src
import Greeting from '@/components/Greeting.vue'
import Dashboard from '@/components/Dashboard.vue';

import auth from '@/auth'

export default {
  name: 'home',
  data() {
    return {
      loggedIn: auth.loggedIn()
    }
  },
  components: {
    Greeting,
    Dashboard
  }
}
</script>
