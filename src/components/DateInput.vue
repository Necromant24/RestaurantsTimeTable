<template>
    <div class="inline">
        choose year:
        <input  v-model="year"/>
        choose month:
        <input  v-model="month"/>
        choose start day:
        <input  v-model="day"/>
        <button @click="emitDate">{{buttonName}}</button>
    </div>
</template>

<script>
    export default {
        name: "DateInput",
        props:{
            buttonName: String
        },
        data: function () {
            return{
                year: "2020",
                month: "03",
                day: "01",
            }
        },
        methods:{
            emitDate:function () {

                this.$emit('date-emit',{date:
                        this.year+"-"+this.month+"-"+this.day
                })
            }
        }
    }
</script>

<style scoped>

    .inline{
        display: flex;
    }
</style>
