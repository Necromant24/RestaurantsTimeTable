<template>
    <div>
        <Parameters v-on:show-table="showTimeTable" />
        <div class="weekGrid">
            <div v-for="(dayList,index) in compTable" :key="index" width="10%" >
                <h3>{{week[index]}}</h3>
                <div v-for="(worker,index2) in dayList['workers']" :key="index2" width="100%">
                    {{worker}}
                    <button @click="deleteWorker(index,index2)">X</button>
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
                week: [],
                timeTable:[],
                addWorkerList: ['','','','','','','','',]
            }
        },
        computed:{
            compTable(){
                return this.timeTable
            }
        },
        methods:{
            get7Dates3(date){
                const getDays = (day=1) => Array.from({length:day},(_,i)=>moment(date).add(i, 'days').format('YYYY MM DD'));

                return getDays(7).map(date=>date.replace(' ','-')).map(date=>date.replace(' ','-'))
            },
            showTimeTable(data){
                tStore.commit('initTimeTableOnWeek',{date:data.date,restaurant:data.restaurant,typeCoock:data.typeCoock})
                alert(" in show method but fetching data")
                this.timeTable = tStore.state.raspisanie[data.restaurant][data.typeCoock]
                console.log(this.timeTable," - test this.timeTable")

                //let weekList = this.getWorkerLists(this.date,this.restaurant,this.typeCoock)
                //console.log(weekList," - weeklisr")
                //this.timeTable = weekList
            },
            deleteWorker(weekIndex,workerIndex){
                let curdate = this.week[weekIndex]
                alert(curdate)
                alert(workerIndex)
                let data = {
                    restaurant: this.restaurant,
                    typeCoock: this.typeCoock,
                    date: curdate,
                    index: workerIndex
                }
                tStore.commit('deleteWorkerFromTable',data)
            },
            addWorker(index){

                let workerData = {

                    date: this.week[index],
                    typeCoock: this.typeCoock,
                    restaurant: this.restaurant,
                    name: this.addWorkerList[index]
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
