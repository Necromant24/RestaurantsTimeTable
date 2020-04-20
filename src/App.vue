<template>
  <div id="app">
    <div class="fixed flexible">
      <div v-for="(text, index) in razdeli" v-bind:key="index">
        <button v-on:click="changeState(index)"> {{text}}</button>
      </div>
    </div>

    <img alt="Vue logo" src="./assets/logo.png">

    <div v-if="state == 0">
      <WorkersRedactor/>
    </div>
    <div v-if="state == 1">
      <WorkersTimeTable />
    </div>
    <div v-if="state == 2">

    </div>

    <div v-if="state == 3">
      <Restaurants/>
    </div>
  </div>
</template>

<script>
import Restaurants from "@/components/Restaurants";
import WorkersRedactor from "@/components/WorkersRedactor";
import WorkersTimeTable from "@/components/WorkersTimeTable";

export default {
  name: 'App',
  components: {
    WorkersTimeTable,
    Restaurants,
    WorkersRedactor,
  },
  data:function(){
    return{
      state:0,
      razdeli:["workers","time table","3","restaurants"]
    }
  },
  methods:{
    changeState: function(index) {
      this.state = index
    },
  }
}
</script>

<style>



  .fixed{
    position: static;
  }

  .flexible{
    display: flex;
  }


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
