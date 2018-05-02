<template>
   <tr>
        <td>{{ job.name }}</td>
        <td>{{ job.allocations != null ? job.allocations.length : 0 }}</td>
        <td>{{ remaining }} ago </td>
        <td>
            <router-link
                v-if="!isPartOfTaskForce || !hasBlamedUser"
                class="btn btn-primary"
                :to="{ name: 'job', params: { id: job._id }}">
            {{ buttonText }}
            </router-link>
        </td>
    </tr>
</template>

<script>
import countdown from "countdown";

export default {
    name: "JobListItem",
    props: ['job', 'userId'],
    data() {
        return {
            remaining: "",
            timer: null,
        }
    },
    computed: {
        isPartOfTaskForce() {
            return this.job.allocations.filter(v => v.userId == this.userId).length > 0;
        },
        hasBlamedUser() {
            return this.job.blamed.filter(v => v.userId == this.userId).length > 0;
        },
        buttonText() {
            if (this.isPartOfTaskForce) {
                return "Blame Team Members";
            } else {
                return "Join Task Force";
            }
        }
    },
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
