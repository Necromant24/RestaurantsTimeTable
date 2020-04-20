import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        restaurants: [],

    },
    mutations: {

        initRestaurants(state, restaurants) {
            console.log(restaurants," - init restaurants")
            state.restaurants = restaurants;
        },

        addRest(state, name) {
            console.log(name," - rest add")
            fetch("http://localhost:5000/Restaurants", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ RestName: name })
            })
                .then(data => {
                    return data;
                })
                .then(data => {
                    console.log(data);
                });

            state.restaurants.push(name);
        },
        deleteRest(state, index) {
            let rest = state.restaurants[index];
            console.log(rest);

            fetch("http://localhost:5000/Restaurants", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({ RestName: rest })
            })
                .then(data => {
                    return data;
                })
                .then(data => {
                    console.log(data);
                });

            state.restaurants.splice(index, 1);
        },

    }
});
