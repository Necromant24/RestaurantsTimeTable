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
    import moment from "moment";
    import tStore from "@/scripts/timeTableStore";



    export default {
        name: "WorkersTimeTable",
        components: {Parameters},
        data: function(){
            return{
                //week: [],
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
            pushToTable(data){
                let objKeys = Object.keys(data)
                objKeys.forEach(key=>this.timeTable.push(data[key]))

            },
            get7Dates3(date){
                const getDays = (day=1) => Array.from({length:day},(_,i)=>moment(date).add(i, 'days').format('YYYY MM DD'));

                return getDays(7).map(date=>date.replace(' ','-')).map(date=>date.replace(' ','-'))
            },
            showTimeTable(data){
                tStore.commit('initTimeTableOnWeek',{date:data.date,restaurant:data.restaurant,typeCoock:data.typeCoock})
                alert(" in show method but fetching data")

                console.log(this.timeTable," - test this.timeTable")

                this.restaurant = data.restaurant
                this.typeCoock = data.typeCoock

                //let weekList = this.getWorkerLists(this.date,this.restaurant,this.typeCoock)
                //console.log(weekList," - weeklisr")
                //this.timeTable = weekList
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

    .block{
        display: block;
    }

</style>
