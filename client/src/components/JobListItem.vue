<template>
   <tr>
        <td>{{ job.name }}</td>
        <td>{{ job.allocations != null ? job.allocations.length : 0 }}</td>
        <td>
            <router-link class="btn btn-primary" :to="{ name: 'job', params: { id: job._id }}">Join task force</router-link>
        </td>
    </tr>
</template>

<script>

export default {
    name: "JobListItem",
    props: ['job'],
}
</script>
