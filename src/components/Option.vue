<template>
    <router-link :to="to" class="option-link">{{ title }}</router-link>
</template>

<script>
export default {
    name: "Option",
    props: {
        title: {
            type: String,
            required: true,
        },
        to:{
            type: String,
            required: true,
        }
    },
}

</script>

<style scoped>
.option-link{
  width: 30%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--highlight1-color);
  color: var(--text-color);
  font-size: x-large;
  cursor: pointer;
  transition: var(--fast-transition);
  text-decoration: none;
}

.option-link:hover{
  background-color: var(--tips-color);
  color: black
}
</style>