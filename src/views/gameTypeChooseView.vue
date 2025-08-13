<template>
  <div class="background">
    <div class="container">
        <h4 class="title">Which TRPG are you goona play?</h4>
        <div class="link-container">
            <router-link to="/coc/game/history" class="option-link">Call of Cthulhu</router-link>
            <router-link to="/dnd/game/history" class="option-link">Dungeons & Dragons</router-link>
        </div>
        <div class="link-container">
            <router-link to="/home" class="home-btn">Back</router-link>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'gameTypeChooseView',
};
</script>

<style scoped>
.background {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;
  background-color: black;
}
.container{
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 30%;
  gap: 15px;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--background-color);
  font-size: x-large;
}
.title{
    font-size: 50px;
    display: flex;
    justify-content: center;
    color: var(--text-color);
}
.link-container{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 5%;
}
.option-link{
  width: 40%;
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

.home-btn{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--highlight2-color);
    color: var(--text-color);
    border: none;
    padding: 15px 30px;
    cursor: pointer;
    font-size: large;
    border-radius: 8px;
    transition: var(--fast-transition);
    text-decoration: none;
    height: 50px;
    width: 20%;
}

.home-btn:hover{
    background-color: var(--highlight1-color);
}
</style>

