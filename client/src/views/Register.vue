<template>
  <div class="register container">
    <form @submit.prevent="register">
        <fieldset>
            <legend>Register</legend>

            <div class="form-group">
                <label for="inputEmail">Email address</label>
                <input v-model="email" type="email" class="form-control" id="inputEmail" aria-describedby="emailHelp" placeholder="Enter email">
            </div>

            <div class="form-group">
                <label for="inputConfirmEmail">Confirm email</label>
                <input v-model="confirmEmail" type="email" class="form-control" id="inputConfirmEmail" aria-describedby="emailHelp" placeholder="Enter email">
            </div>

            <div class="form-group">
                <label for="inputPassword">Password</label>
                <input v-model="pass" type="password" class="form-control" id="inputPassword" placeholder="Password">
            </div>

            <div class="form-group">
                <label for="inputConfirmPassword">Confirm password</label>
                <input v-model="confirmPassword" type="password" class="form-control" id="inputConfirmPassword" placeholder="Password">
            </div>
        </fieldset>

        <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
 export default {
    data () {
      return {
        email: '',
        confirmEmail: '',
        pass: '',
        confirmPassword: '',
        error: false
      }
    },
    methods: {
        register() {

        }
    }
 }
</script>
