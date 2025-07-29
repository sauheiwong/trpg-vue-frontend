<template>
    <tr>
        <td>{{ game.title }}</td>
        <td>{{ game.updatedAt.substring(0, 10) }}</td>
        <td><router-link :to="`/coc/${game._id}`" class="link">Go</router-link></td>
    </tr>
    
</template>

<script>
export default {
    name: "gameList",
    props: {
        game: {
            type: Object,
        }
    },
}

</script>

<style scoped>

tr:hover {
    background-color: var(--highlight2-color);
}

.link{
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--highlight2-color);
  color: var(--text-color);
  font-size: x-large;
  cursor: pointer;
  transition: var(--fast-transition);
  text-decoration: none;
}

.link:hover{
  background-color: var(--highlight1-color);
  color: black
}
</style>