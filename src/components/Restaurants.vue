<template>
  <div>
      <ol>
          <div class="inline" v-for="(restaurant,index) in restaurants" :key="index">
          <li>{{restaurant}}</li>
          <button @click="deleteRest(index)">X</button>
          </div>
      </ol>
      <div class="inline">
          <input v-model="textField"/>
          <button @click="addRest">Add</button>
      </div>

  </div>
</template>

<script>

import rStore from "@/scripts/restaurantStore";

export default {
  name: 'Restaurants',
      rStore,
  data: function() {
    return {
        textField: ""
    }
  },
  methods: {
      deleteRest(index){
          rStore.commit('deleteRest',index)
      },
      addRest(){
          rStore.commit('addRest',this.textField)
            this.textField = ""
      },
      initRestaurants(restaurants){
          rStore.commit('initRestaurants',restaurants)
      }
  },
  computed: {
      restaurants: function(){ return rStore.state.restaurants }
  }
}
</script>

<style>

.inline{
    display: flex;
}

</style>
