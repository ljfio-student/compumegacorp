<template>
    <div class="jobs container">
        <h1>Jobs</h1>

        <button type="button" class="btn btn-primary" v-on:click="createJob">Go to work!</button>

        <table class="table table-hover">
            <thead>
                <tr>
                <th scope="col">Name</th>
                <th scope="col">Players</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="job in jobs" :key="job._id">
                    <td>{{ job.name }}</td>
                    <td>{{ job.allocations != null ? job.allocations.length : 0 }}</td>
                    <td>
                        <router-link class="btn btn-primary" :to="{ name: 'job', params: { id: job._id }}">Join task force</router-link>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import auth from '@/auth';

export default {
    data() {
        return {
            jobs: []
        }
    },
    created() {
        // Get the current list of jobs
        auth.http().get('/job')
            .then(response => {
                if (response.data) {
                    this.jobs = response.data;
                }
            });
    },
    methods: {
        createJob() {
            auth.http().post('/job')
                .then(response => {
                    if (response.data && response.data.success) {
                        this.$router.replace('/job/' + response.data.id);
                    } else {
                        console.log('could not create job');
                    }
                });
        }
    }
}
</script>

