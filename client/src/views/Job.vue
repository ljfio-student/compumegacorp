<template>
    <div class="job container">
        <h1>{{ name }}</h1>

      <form @submit.prevent="join" v-if="!isUserPresent">
        <fieldset class="form-group">
          <legend>Select a Task</legend>
          <div class="form-check"  v-for="task in tasks" v-bind:key="task._id">
            <label class="form-check-label">
              <input type="radio" class="form-check-input" v-model="selected" v-bind:value="task._id" />
              {{ task.name }}
            </label>
          </div>
        </fieldset>

        <button class="btn btn-primary" type="submit">Join</button>
      </form>
    </div>
</template>

<script>
import auth from "@/auth";

export default {
  data() {
    return {
      selected: "",
      name: "",
      tasks: [],
      users: [],
    };
  },
  computed: {
    isUserPresent() {
      return this.users.findIndex(v => v == auth.getUserId()) > -1
    }
  },
  created() {
   this.loadData();
  },
  methods: {
    join() {
      auth.http().post('/job/' + this.$route.params.id + '/task/' + this.selected)
        .then(result => {
          this.loadData();
        });
    },
    loadData() {
       auth
        .http()
        .get("/job/" + this.$route.params.id)
        .then(jobResult => {
          this.name = jobResult.data.name;
          this.users = jobResult.data.allocations.map(a => a.userId);

          jobResult.data.tasks.forEach(element => {
            auth
              .http()
              .get("/task/" + element)
              .then(taskResult => {
                this.tasks.push(taskResult.data);
              });
          });
        });
    }
  }
};
</script>

