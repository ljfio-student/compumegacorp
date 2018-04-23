<template>
    <div class="jobs container">
        <ul>
            <li v-for="job in jobs" :key="job._id">
                {{ job.name }}
            </li>
        </ul>
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

