<template>
    <div class="job container">
      <h1>{{ name }}</h1>

      <form @submit.prevent="join" v-if="!isUserPresent">
        <fieldset>
          <fieldset class="form-group">
            <legend>Select a Task</legend>
            <div class="form-check" v-for="task in tasks" :key="task._id">
              <input type="radio" class="form-check-input" v-model="selectedTaskId" :value="task._id" />
              <label class="form-check-label">{{ task.name }}</label>
            </div>
          </fieldset>
        </fieldset>

        <button class="btn btn-primary" type="submit">Join</button>
      </form>

      <form @submit.prevent="blame" v-if="isUserPresent">
        <fieldset class="form-group">
          <legend>Select a User to Blame</legend>
          <div class="form-check" v-for="member in members" :key="member._id">
            <input type="radio" class="form-check-input" v-model="selectedMemberId" :value="member._id" />
            <label class="form-check-label">{{ member.name }}</label>
          </div>
        </fieldset>
      </form>
    </div>
</template>

<script>
import auth from "@/auth";

export default {
  data() {
    return {
      selectedTaskId: "",
      selectedMemberId: "",
      name: "",
      tasks: [],
      members: [],
      blamed: [],
    };
  },
  computed: {
    isUserPresent() {
      return this.members.findIndex(v => v._id == auth.getUserId()) > -1;
    }
  },
  created() {
   this.loadData();
  },
  methods: {
    join() {
      auth.http().post('/job/' + this.$route.params.id + '/task/' + this.selectedTaskId)
        .then(result => {
          this.loadData();
        });
    },
    blame() {
      auth.http().post('/job/' + this.$route.params.id + '/blame' + this.selectedMemberId)
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

          jobResult.data.tasks.forEach(element => {
            auth.http()
              .get("/task/" + element)
              .then(taskResult => {
                this.tasks.push(taskResult.data);
              });
          });

          jobResult.data.allocations.map(a => a.userId).forEach(element => {
            auth.http()
              .get("/user/" + element)
              .then(userResult => {
                this.members.push(userResult.data);
              });
          })
        });
    }
  }
};
</script>

