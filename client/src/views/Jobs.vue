<template>
    <div class="jobs container">
        <h1>Jobs</h1>

        <button type="button" class="btn btn-primary" v-on:click="createJob">Go to work!</button>

        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Players</th>
                    <th scope="col">Started</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                <job-list-item
                    v-for="(job, index) in jobs"
                    v-bind:job="job"
                    v-bind:index="index"
                    v-bind:user-id="userId"
                    v-bind:key="job._id" />
            </tbody>
        </table>
    </div>
</template>

<script>
import auth from '@/auth';
import JobListItem from "@/components/JobListItem";

export default {
    data() {
        return {
            jobs: [],
            userId: null,
        }
    },
    created() {
        this.userId = auth.getUserId();

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
    },
    components: {
        JobListItem
    }
}
</script>

