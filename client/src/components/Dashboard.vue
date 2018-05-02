<template>
  <div class="dashboard container">
    <h1>Welcome back, {{name}}!</h1>
    <div class="row">
      <div class="col-sm">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{role}} <small>({{score}})</small></h5>
            <h6 class="card-subtitle mb-2 text-muted">Current Role</h6>
            <p class="card-text">This is your current role within the company.</p>
          </div>
        </div>
      </div>
      <div class="col-sm">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{blamed}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Times Blamed</h6>
            <p class="card-text">The number of times that you have been blamed for the task failing.</p>
          </div>
        </div>
      </div>
      <div class="col-sm">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">{{escaped}}</h5>
            <h6 class="card-subtitle mb-2 text-muted">Times Escaped</h6>
            <p class="card-text">The number of times that you have escaped blame for the task failing.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import auth from "@/auth";

export default {
  name: "Dashboard",
  data() {
    return {
      name: "",
      score: 0,
      blamed: 0,
      escaped: 0,
    };
  },
  computed: {
    role() {
      if (this.score < 200) {
        return "New Start";
      } else if (this.score < 300) {
        return "Supervisor"
      } else if (this.score < 400) {
        return "Assistant Manager";
      } else if (this.score < 500) {
        return "Manager";
      } else if (this.score < 600) {
        return "Vice President";
      } else if (this.score < 700) {
        return "Senior Vice President";
      } else {
        return "CEO";
      }
    }
  },
  created() {
    auth.http().get('/user')
      .then(response => {
        this.name = response.data.name;
        this.score = response.data.score;
        this.blamed = response.data.blamed;
        this.escaped = response.data.escaped;
      });
  }
};
</script>