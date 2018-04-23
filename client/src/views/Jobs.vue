<template>
    <div class="jobs container">
        <h1>Jobs</h1>

        <button type="button" class="btn btn-primary">Go to work!</button>

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
                    <td>{{ job.users.length }}</td>
                    <td>
                        <button type="button" class="btn btn-primary">Join workgroup</button>
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
        auth.http().get('/job')
            .then(response => {
                console.log(response);
                if (response.data) {
                    this.jobs = response.data;
                }
            })
    }
}


</script>

