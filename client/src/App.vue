<template>
  <div id="app">
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark" id="nav">
      <router-link to="/" class="navbar-brand" >CompuMegaCorp</router-link>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarControls" aria-controls="navbarControls" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarControls">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="loggedIn">
            <router-link to="/jobs" class="nav-link" data-toggle="collapse" data-target="#navbarControls">Jobs</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/about" class="nav-link" data-toggle="collapse" data-target="#navbarControls">About</router-link>
          </li>
        </ul>

        <ul class="navbar-nav" v-if="!loggedIn">
          <li class="nav-item">
            <router-link to="/register" class="nav-link" data-toggle="collapse" data-target="#navbarControls">Register</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/login" class="nav-link" data-toggle="collapse" data-target="#navbarControls">Login</router-link>
          </li>
        </ul>

        <ul class="navbar-nav" v-if="loggedIn">
          <li class="nav-item">
            <a href="#" class="nav-link"  data-toggle="modal" data-target="#chatModel">Chat</a>
          </li>
          <li class="nav-item">
            <router-link to="/logout" class="nav-link" data-toggle="collapse" data-target="#navbarControls">Logout</router-link>
          </li>
        </ul>

        <span class="navbar-text" data-toggle="tooltip" data-placement="bottom" title="Current share price">
          $100
        </span>
      </div>
    </nav>

    <router-view/>

    <chat v-if="loggedIn" />
  </div>
</template>

<style lang="scss">
@import './styles/_variables.scss';
@import './styles/_bootswatch.scss';
@import '../node_modules/bootstrap/scss/bootstrap.scss';

body {
  margin-top: 58px;
}
</style>

<script>
import 'jquery';
import 'popper.js';
import 'bootstrap';

import auth from '@/auth'

import Chat from "@/components/Chat.vue";

export default {
  data () {
    return {
      loggedIn: auth.loggedIn()
    }
  },
  created () {
    auth.onChange = loggedIn => {
      this.loggedIn = loggedIn
    }
  },
  components: {
    Chat
  }
}
</script>