<template>
  <div class="register container">
    <form @submit.prevent="register">
        <fieldset>
            <legend>Register</legend>

            <div class="form-group">
                <label for="inputName">Name</label>
                <input v-model="name" type="text" class="form-control" id="inputName" placeholder="Joe Bloggs">
            </div>

            <div class="form-group">
                <label for="inputEmail">Email address</label>
                <input v-model="email" type="email" class="form-control" id="inputEmail" placeholder="joe@example.com">
            </div>

            <div class="form-group">
                <label for="inputConfirmEmail">Confirm email</label>
                <input v-model="confirmEmail" type="email" class="form-control" id="inputConfirmEmail" placeholder="joe@example.com">
            </div>

            <div class="form-group">
                <label for="inputPassword">Password</label>
                <input v-model="pass" type="password" class="form-control" id="inputPassword" placeholder="Pa$$w0rd">
            </div>

            <div class="form-group">
                <label for="inputConfirmPassword">Confirm password</label>
                <input v-model="confirmPass" type="password" class="form-control" id="inputConfirmPassword" placeholder="Pa$$w0rd">
            </div>
        </fieldset>

        <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
import auth from "@/auth";

export default {
  data() {
    return {
      name: "",
      email: "",
      confirmEmail: "",
      pass: "",
      confirmPass: "",
      error: false
    };
  },
  methods: {
    register() {
        if (this.email == null || this.confirmEmail == null || this.email.toLowerCase() != this.confirmEmail.toLowerCase()) {
            // The email address is not set or doesn't match
            this.error = true;
            return;
        }


        if (this.pass == null || this.confirmPass == null || this.pass != this.confirmPass) {
            // The password is not set or doesn't match
            this.error = true;
            return;
        }

        auth.http().post('/user/register', {
            name: this.name,
            email: this.email,
            password: this.pass,
        })
        .then(response => {
            if (response.error) {
                // could be because the email already exists
            } else {
                this.$router.replace(this.$route.query.redirect || '/')
            }
        })
        .catch(error => {
            this.error = true;
        })
    }
  }
};
</script>
