<template>
    <div>
        <Parameters v-on:show-table="showTimeTable" />
        <div class="weekGrid">
            <div v-for="(dayList,index) in compTable" :key="index" width="10%" >
                <h3>{{dayList.date}}+{{index}}</h3>
                <div v-for="(worker,index2) in dayList['workers']" :key="index2" width="100%">
                    {{worker}}
                    <button @click="deleteWorker(index,index2,dayList.date)">X</button>
                </div>
                <div class="inline">
                    <input v-model="addWorkerList[index]"/>
                    <button @click="addWorker(index)">Add</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Parameters from "@/components/Parameters";
    import tStore from "@/scripts/timeTableStore";


    export default {
        name: "WorkersTimeTable",
        components: {Parameters},
        data: function(){
            return{
                restaurant: "",
                typeCoock: "",
                timeTable:[],
                addWorkerList: ['','','','','','','','',]
            }
        },
        computed:{
            compTable(){
                return tStore.state.weekList
            },
            week(){
                return  tStore.state.weekDays
            }
        },
        methods:{
            showTimeTable(data){
                tStore.commit('initTimeTableOnWeek',{date:data.date,restaurant:data.restaurant,typeCoock:data.typeCoock})
                alert(" in show method but fetching data")

                console.log(this.timeTable," - test this.timeTable")

                this.restaurant = data.restaurant
                this.typeCoock = data.typeCoock

            },
            deleteWorker(weekIndex,workerIndex,dayDate){
                let curdate = dayDate
                let data = {
                    restaurant: this.restaurant,
                    typeCoock: this.typeCoock,
                    date: curdate,
                    wIndex: workerIndex,
                    dayIndex:weekIndex
                }
                tStore.commit('deleteWorkerFromTable',data)
            },
            addWorker(index){

                console.log(this.week," -from computed week")

                let workerData = {
                    date: this.compTable[index].date,
                    typeCoock: this.typeCoock,
                    restaurant: this.restaurant,
                    name: this.addWorkerList[index],
                    dayIndex:index
                }

                console.log(workerData," - worker to add")

                tStore.commit('addWorkerInTable',workerData)

            },
        }
    }
</script>

<style scoped>

    .inline{
        display: flex;
        width: 100%;
    }

    .weekGrid{
        display: grid;
        grid-template-columns: repeat(7,1fr) ;
    }

</style>
