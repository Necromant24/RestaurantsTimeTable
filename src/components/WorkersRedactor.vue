<template>
    <div>
        <table>
            <tr>
                <td>№</td>
                <td>worker name</td>
                <td>type food he cooks</td>
                <td>days timetable</td>
            </tr>
            <tr v-for="(line,index) in wdata" :key="index">
                <td>{{index}}</td>
                <td>{{line.firstName}}</td>
                <td>{{line.coockType}}</td>
                <td>{{line.timetable}}</td>
                <td><button v-on:click="deleteRow(index)">X</button></td>
            </tr>
            <tr>
                <td>№</td>
                <td>worker name
                    <input v-model="nextToAdd.firstName" >
                </td>
                <td>type food he cooks
                    <input list="foodType" v-model="nextToAdd.coockType" >
                    <datalist id="foodType">
                        <option>italy</option>
                        <option>rus</option>
                        <option>french</option>
                    </datalist>
                </td>
                <td>days timetable
                    <input list="daysTable" v-model="nextToAdd.timetable" >
                    <datalist id="daysTable">
                        <option>2/2</option>
                        <option>5/2</option>
                    </datalist>
                </td>
                <td><button v-on:click="addRow">Add</button> </td>
            </tr>

        </table>
    </div>
</template>

<script>
import wStore from "@/scripts/workerStore";


    export default {
        name: "WorkersRedactor",
        wStore,
        data: function () {
            return {
                nextToAdd: {'firstName': 'igor', coockType: 'italy', timetable: '5/2'}
            }
        },
        created: function(){
            fetch('http://localhost:5000/Workers',{
            method: 'GET',
        }).then((response)=>{
            return response.json()
        }).then((data)=>{
            console.log(data['data']," - workers data")
                wStore.commit('initWorkers',data['data'])
        })
            
            
        },
        computed: {
            wdata () {
                return wStore.state.workersData
            }
        },
        methods: {
            deleteRow: function(index) {
                //this.workersData.splice(index,1)
                wStore.commit('deleteWorker', index)
            },
            addRow: function () {
                //this.wdata.push(Object.assign({}, this.nextToAdd))
                wStore.commit('addWorker',Object.assign({},this.nextToAdd))
                this.nextToAdd = {'FirstName': '', CoockType: '', Timetable: ''}
            }
        }
    }
</script>

<style scoped>

</style>
