<template>
  <div class="login container">
      <form>
        <fieldset>
            <legend>Login</legend>

            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input v-model="pass" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
        </fieldset>

        <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script>
  import auth from '@/auth'

  export default {
    data () {
      return {
        email: '',
        pass: '',
        error: false
      }
    },
    methods: {
      login () {
        auth.login(this.email, this.pass, loggedIn => {
          if (!loggedIn) {
            this.error = true
          } else {
            this.$router.replace(this.$route.query.redirect || '/')
          }
        })
      }
    }
  }
</script>

