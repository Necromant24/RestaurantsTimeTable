import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        workersData: [
            // { FirstName: "egor", CoockType: "italy", Timetable: "2/2" },
            // { FirstName: "oleg", CoockType: "rus", Timetable: "2/2" },
            // { FirstName: "alex", CoockType: "french", Timetable: "5/2" }
        ],
        // firstName:{....}
        dictWorkersData:{

        }

    },
    mutations: {

        initWorkers(state) {

            fetch('http://localhost:5000/Workers',{
                method: 'GET',
            }).then((response)=>{
                return response.json()
            }).then((data)=>{
                console.log(data['data']," - workers data")
                //wStore.commit('initWorkers',data['data'])
                let workers = data.data
                state.workersData = workers;
                let dictData ={}
                state.workersData.forEach(data=>{
                    dictData[data.firstName]={coockType:data.coockType,timetable:data.timetable}
                })
                state.dictWorkersData = dictData
                console.log(state.dictWorkersData," = dicted workers data")
            })

        },
        addWorker(state, worker) {
            fetch("http://localhost:5000/Workers", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    FirstName: worker["firstName"],
                    CoockType: worker["coockType"],
                    Timetable: worker["timetable"]
                })
            })
                .then(data => {
                    return data;
                })
                .then(data => {
                    console.log(data);
                });

            state.workersData.push(worker);
            state.dictWorkersData[worker.firstName]={coockType:worker.coockType,timetable:worker.timetable}
        },
        deleteWorker(state, index) {
            let workerName = state.workersData[index]["firstName"];

            console.log(workerName);

            fetch("http://localhost:5000/Workers/" + workerName, {
                method: "DELETE",
                headers: {
                    "Content-Type": "text/plain"
                }
            })
                .then(data => {
                    return data;
                })
                .then(data => {
                    console.log(data);
                });

            state.workersData.splice(index, 1);
            delete state.dictWorkersData[workerName]
        },

    }
});
