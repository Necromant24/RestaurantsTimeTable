import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {

        // raspisanie['restaurant']['coockType']['date']([workers][index]/[weekDay])
        raspisanie: {
            rusich: {
                rus: {
                }
            }
        },
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


            // restaurants.forEach(restaurant=>{
            //   console.log(restaurant)
            //   console.log("roreach")
            //   state.raspisanie[restaurant]={rus:{},french:{},italy:{}}
            // })

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
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then(data => {
                    return data.json();
                })
                .then(jsonData => {
                    console.log(jsonData," - fetched raspisanie");
                    //let oldData = state.raspisanie[data.restaurant][data.typeCoock]
                    //let newRasp = Object.assign(oldData,jsonData)

                    //state.raspisanie[data.restaurant][data.typeCoock]= newRasp

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
                    //console.log(state.raspisanie.rusich.rus)
                });


        },
        addWorkerInTable(state, worker) {

            console.log(state.raspisanie[worker.restaurant][worker.typeCoock]," -")
            if(!Object.keys(state.raspisanie[worker.restaurant][worker.typeCoock]).includes(worker.date)){
                console.log("not contains")
                state.raspisanie[worker.restaurant][worker.typeCoock][worker.date]= {weekDay:new moment(worker.date).day(),workers:[]}
            }




            state.raspisanie[worker.restaurant][worker.typeCoock][worker.date][
                "workers"
                ].push(worker.name);

            let worker_timetable = {};

            console.log(state.workersData);

            function GetWorkerTable(name) {
                console.log(state.workersData)
                state.workersData.forEach(worker => {

                    if (worker.firstName == name) {
                        console.log(worker.firstName, "- is worker");
                        worker_timetable[name]=worker.timetable
                    }
                });


            }

            let workerList =
                state.raspisanie[worker.restaurant][worker.typeCoock][worker.date][
                    "workers"
                    ];

            console.log(workerList, " - workerList");

            //let workerNames = []

            workerList.forEach(element => {
                console.log(element," - element")
                GetWorkerTable(element);
            });

            console.log(worker_timetable," - is worker_timetable")

            let workerJSON = JSON.stringify({
                Workers: JSON.stringify(worker_timetable),
                Restaurant: worker.restaurant,
                CoockType: worker.typeCoock,
                Date: worker.date
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
                    console.log(data," - adding worker in table");

                });
        },




        deleteWorkerFromTable(state, data) {
            //restaurant,coockType,date,index

            console.log(data.restaurant, data.typeCoock, data.date, data.index);
            state.raspisanie[data.restaurant][data.typeCoock][data.date][
                "workers"
                ].splice(data.index, 1);


            let worker_timetable = {};

            console.log(state.workersData);

            function GetWorkerTable(name) {
                console.log(state.workersData)
                state.workersData.forEach(worker => {

                    if (worker.firstName == name) {
                        console.log(worker.firstName, "- is worker");
                        worker_timetable[name]=worker.timetable
                    }
                });


            }

            let workerList =
                state.raspisanie[data.restaurant][data.typeCoock][data.date][
                    "workers"
                    ];

            console.log(workerList, " - workerList");

            //let workerNames = []

            workerList.forEach(element => {
                console.log(element," - element")
                GetWorkerTable(element);
            });

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
