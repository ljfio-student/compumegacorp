<template>
  <div class="home">
    <hello-world v-if="!loggedIn" />
    <dashboard v-if="loggedIn" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
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
    HelloWorld,
    Dashboard
  }
}
</script>
