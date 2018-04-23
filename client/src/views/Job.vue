<template>
    <div class="job container">
        <h1>{{ name }}</h1>

      <form @submit.prevent="join">
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
      tasks: []
    };
  },
  created() {
    auth
      .http()
      .get("/job/" + this.$route.params.id)
      .then(jobResult => {
        this.name = jobResult.data.name;

        jobResult.data.tasks.forEach(element => {
          auth
            .http()
            .get("/task/" + element)
            .then(taskResult => {
              this.tasks.push(taskResult.data);
            });
        });
      });
  },
  methods: {
    join() {
      auth.http().post('/job/' + this.$route.params.id + '/task/' + this.selected)
        .then(result => {

        })
    }
  }
};
</script>

