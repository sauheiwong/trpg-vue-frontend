<template>
    <tr>
        <td>{{ name }}</td>
        <td>{{ characterClass }}</td>
    </tr>
    
</template>

<script>
export default {
    name: "COCCharacterList",
    props: {
        name: { type: String },
        characterClass: { type: String },
    },
}

</script>

<style scoped>
tr:hover {
    background-color: var(--highlight2-color);
    color: var(--text-color);
}

td {
    border: 1px solid white;
    cursor: pointer;
}

</style>