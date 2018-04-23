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
                <input v-model="confirmPassword" type="password" class="form-control" id="inputConfirmPassword" placeholder="Pa$$w0rd">
            </div>
        </fieldset>

        <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      email: "",
      confirmEmail: "",
      pass: "",
      confirmPassword: "",
      error: false
    };
  },
  methods: {
    register() {}
  }
};
</script>
