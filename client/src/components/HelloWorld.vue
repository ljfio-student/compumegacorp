<template>
  <div class="hello">
     <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">CompuMegaCorp</h1>
        <p class="lead">The ultimate work simulator&hellip;</p>
        <p class="lead text-center">
          <router-link to="/login" class="btn btn-lg btn-primary">Login</router-link>
          <router-link to="/register" class="btn btn-lg btn-secondary">Register</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld'
}
</script>