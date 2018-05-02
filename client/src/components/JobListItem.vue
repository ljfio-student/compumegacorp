<template>
   <tr>
        <td>{{ job.name }}</td>
        <td>{{ job.allocations != null ? job.allocations.length : 0 }}</td>
        <td>{{ remaining }} ago </td>
        <td>
            <router-link class="btn btn-primary" :to="{ name: 'job', params: { id: job._id }}">Join task force</router-link>
        </td>
    </tr>
</template>

<script>
import countdown from "countdown";

export default {
    name: "JobListItem",
    data() {
        return {
            remaining: "",
            timer: null,
        }
    },
    props: ['job'],
    created() {
        this.timer = countdown(new Date(this.job.posted), (ts) => {
            this.remaining = ts.toString();
        }, countdown.HOURS | countdown.MINUTES)
    },
    destroyed() {
        window.clearInterval(this.timer);
    }
}
</script>
