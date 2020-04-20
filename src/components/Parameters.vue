<template>
    <div>
        <DateInput button-name="show table" v-on:date-emit="showTable" />
        <div class="inline">
            choose restaurant:<input list="restaurants" v-model="restaurant"/>

            choose coock type:<input list="typecoock" v-model="typeCoock"/>

            <datalist id="typecoock">
                <option v-for="restType in ['rus','italy','french']" :key="restType">{{restType}}</option>
            </datalist>
            <datalist id="restaurants">
                <option v-for="restaurant in restaurants" :key="restaurant">{{restaurant}}</option>
            </datalist>

        </div>
    </div>
</template>

<script>
    import DateInput from "@/components/DateInput";
    import rStore from "@/scripts/restaurantStore";


    export default {
        name: "Parameters",
        components: {DateInput},
        data: function () {
            return{
                restaurant: "",
                typeCoock: "",
            }
        },
        methods:{
            showTable(data){
                this.$emit('show-table',Object.assign(data,{restaurant:this.restaurant,typeCoock:this.typeCoock}))
            }
        },
        computed:{
            restaurants: ()=>{
                return rStore.state.restaurants
            },
        }
    }
</script>

<style scoped>

    .inline{
        display: flex;
    }
</style>
