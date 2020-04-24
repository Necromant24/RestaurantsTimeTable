import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import workerStore from "@/scripts/workerStore";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        weekList:[],
        weekDays:[]
    },
    mutations: {

        initRaspisanieFields(state,restaurants){

            console.log(restaurants, " - rsnrs")
            console.log(state.restaurants," - from state")

            for (let i=0;i<restaurants.length;i++){
                console.log(restaurants[i])
                state.raspisanie[restaurants[i]]={rus:{},french:{},italy:{}}
            }

            console.log(state.raspisanie," - inited fields")
        },
        initTimeTableOnWeek(state,data){
            console.log(data," - is raspdata to send")


            var url = new URL("http://localhost:5000/TimeTable")
            // date=2020-03-01&daysCount=2&restaurant=rusich&coockType=rus
            var params = {date:data.date,daysCount:7,restaurant:data.restaurant,coockType:data.typeCoock}

            url.search = new URLSearchParams(params).toString();

            console.log(url)

            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(data => {
                    return data.json();
                })
                .then(jsonData => {
                    console.log(jsonData," - fetched raspisanie");

                    const get7Dates3 = function(date){
                        const getDays = (day=1) => Array.from({length:day},(_,i)=>moment(date).add(i, 'days').format('YYYY MM DD'));

                        return getDays(7).map(date=>date.replace(' ','-')).map(date=>date.replace(' ','-'))
                    }

                    state.weekDays = Object.keys(jsonData)

                    let dates7 = get7Dates3(data.date)
                    let wList = []

                    dates7.forEach(wday=>wList.push(Object.assign({date:wday},jsonData[wday])))

                    console.log(wList," - wlist")

                    state.weekList = wList

                    console.log(state.weekDays," - week days")

                });
        },

        // readding worker list
        addWorkerInTable(state, data) {


            let worker_timetable = {};
            state.weekList[data.dayIndex].workers.push(data.name)


            let workerData = workerStore.state.dictWorkersData[data.name]


            console.log(workerData," - worker data")

            let daysWork = 0;
            let daysUnwork = 0;
            if(workerData.timetable.toString()==="2/2"){
                daysWork=2
                daysUnwork=2
            }else {
                daysWork=5
                daysUnwork=2
            }

            let dayWorksCount = 0
            let dayUnworksCount = 0

            let lastWorkDay = 0
            let firstWorkDay = data.dayIndex





            // block of code with 4 fors to check valid work/unwork intervals
            console.log("----------------")
            for(let i=data.dayIndex;i<7;i++){
                if(state.weekList[i].workers.includes(data.name))
                {
                    dayWorksCount+=1
                    lastWorkDay = i
                    console.log(dayWorksCount)
                }else {
                    break
                }
            }
            console.log("----------------")

            for(let i=lastWorkDay+1;i<7;i++){
                if(!state.weekList[i].workers.includes(data.name))
                {
                    dayUnworksCount+=1
                }else {
                    break
                }
            }

            console.log("----------------")
            for(let i=data.dayIndex-1;i>=0;i--){
                if(state.weekList[i].workers.includes(data.name))
                {
                    dayWorksCount+=1
                    firstWorkDay = i
                    console.log(dayWorksCount)
                }else {
                    break
                }
            }
            console.log("----------------")

            for(let i=firstWorkDay-1;i>=0;i--){
                if(!state.weekList[i].workers.includes(data.name))
                {
                    dayUnworksCount+=1
                }else {
                    break
                }
            }






            console.log(daysUnwork,daysWork," -daysUnwork,daysWork")
            console.log(dayUnworksCount,dayWorksCount,"-daysUnworksCount,daysWorksCount")
            console.log(lastWorkDay,firstWorkDay,' - lastWorkDay,firstWorkDay')

            if(dayWorksCount>daysWork){
                alert('слишком много дней он работает')
            }

            if(dayUnworksCount<daysUnwork){
                alert('слишком малый интервал отдыха после')
            }














            state.weekList[data.dayIndex].workers.forEach(wname=>{
                worker_timetable[wname]=workerStore.state.dictWorkersData[wname].timetable
            })


            console.log(worker_timetable," - is worker_timetable")

            let workerJSON = JSON.stringify({
                Workers: JSON.stringify(worker_timetable),
                Restaurant: data.restaurant,
                CoockType: data.typeCoock,
                Date: data.date
            });

            console.log(workerJSON," - workers json")

            fetch("http://localhost:5000/TimeTable", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: workerJSON
            })
                .then(data => {
                    return data;
                })
                .then(data => {
                    console.log(data," - adding worker in table");

                });
        },


        deleteWorkerFromTable(state, data) {
            //data keys - restaurant,coockType,date,index

            console.log(data," - in delete worker - data");


            let worker_timetable = {};
            state.weekList[data.dayIndex].workers.splice(data.wIndex,1)

            state.weekList[data.dayIndex].workers.forEach(wname=>{
                worker_timetable[wname]=workerStore.state.dictWorkersData[wname].timetable
            })


            let workerJSON = JSON.stringify({
                Workers: JSON.stringify(worker_timetable),
                Restaurant: data.restaurant,
                CoockType: data.typeCoock,
                Date: data.date
            });

            fetch("http://localhost:5000/TimeTable", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: workerJSON
            })
                .then(data => {
                    return data;
                })
                .then(data => {
                    console.log(data," - removing worker in table");

                });

        }
    }
});
