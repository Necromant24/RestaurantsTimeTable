import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import workerStore from "@/scripts/workerStore";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        previousWeekList:[],
        weekList:[],
        nextWeekList:[],
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

            let previousWeekDate = moment(data.date).add(-7,'days').format('YYYY MM DD').replace(' ','-')
            let nextWeekDate = moment(data.date).add(7,'days').format('YYYY MM DD').replace(' ','-')


            // date=2020-03-01&daysCount=2&restaurant=rusich&coockType=rus

            let url = new URL("http://localhost:5000/TimeTable")
            let params = {date:data.date,daysCount:7,restaurant:data.restaurant,coockType:data.typeCoock}
            url.search = new URLSearchParams(params).toString();

            let urlPrevious = new URL("http://localhost:5000/TimeTable")
            let paramsPrevious = {date:previousWeekDate,daysCount:7,restaurant:data.restaurant,coockType:data.typeCoock}
            urlPrevious.search = new URLSearchParams(paramsPrevious).toString();

            let urlNext = new URL("http://localhost:5000/TimeTable")
            let paramsNext = {date:nextWeekDate,daysCount:7,restaurant:data.restaurant,coockType:data.typeCoock}
            urlNext.search = new URLSearchParams(paramsNext).toString();



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


            // fetch previous&next week

            fetch(urlPrevious, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(data => {
                    return data.json();
                })
                .then(jsonData => {
                    console.log(jsonData," - fetched raspisanie previous");

                    const get7Dates3 = function(date){
                        const getDays = (day=1) => Array.from({length:day},(_,i)=>moment(date).add(i-7, 'days').format('YYYY MM DD'));

                        return getDays(7).map(date=>date.replace(' ','-')).map(date=>date.replace(' ','-'))
                    }

                    state.weekDays = Object.keys(jsonData)

                    let dates7 = get7Dates3(data.date)
                    let wList = []

                    dates7.forEach(wday=>wList.push(Object.assign({date:wday},jsonData[wday])))

                    console.log(wList," - wlist")

                    state.previousWeekList = wList

                    console.log(state.weekDays," - week days")

                });


            fetch(urlNext, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
                .then(data => {
                    return data.json();
                })
                .then(jsonData => {
                    console.log(jsonData," - fetched raspisanie next");

                    const get7Dates3 = function(date){
                        const getDays = (day=1) => Array.from({length:day},(_,i)=>moment(date).add(i+7, 'days').format('YYYY MM DD'));

                        return getDays(7).map(date=>date.replace(' ','-')).map(date=>date.replace(' ','-'))
                    }

                    state.weekDays = Object.keys(jsonData)

                    let dates7 = get7Dates3(data.date)
                    let wList = []

                    dates7.forEach(wday=>wList.push(Object.assign({date:wday},jsonData[wday])))

                    console.log(wList," - wlist")

                    state.nextWeekList = wList

                    console.log(state.weekDays," - week days")

                });


        },

        // readding worker list
        addWorkerInTable(state, data) {


            let worker_timetable = {};
            state.weekList[data.dayIndex].workers.push(data.name)


            let workerData = workerStore.state.dictWorkersData[data.name]


            console.log(workerData," - worker data")

            // let daysWork = 0;
            // let daysUnwork = 0;
            // if(workerData.timetable.toString()==="2/2"){
            //     daysWork=2
            //     daysUnwork=2
            // }else {
            //     daysWork=5
            //     daysUnwork=2
            // }
            //
            // let dayWorksCount = 0
            // let dayUnworksCount = 0
            //
            // let lastWorkDay = 0
            // let firstWorkDay = data.dayIndex





            // block of code with 4 fors to check valid work/unwork intervals
            // console.log("----------------")
            //             // for(let i=data.dayIndex;i<7;i++){
            //             //     if(state.weekList[i].workers.includes(data.name))
            //             //     {
            //             //         dayWorksCount+=1
            //             //         lastWorkDay = i
            //             //         console.log(dayWorksCount)
            //             //     }else {
            //             //         break
            //             //     }
            //             // }
            //             // console.log("----------------")
            //             //
            //             // for(let i=lastWorkDay+1;i<7;i++){
            //             //     if(!state.weekList[i].workers.includes(data.name))
            //             //     {
            //             //         dayUnworksCount+=1
            //             //     }else {
            //             //         break
            //             //     }
            //             // }
            //             //
            //             // console.log("----------------")
            //             // for(let i=data.dayIndex-1;i>=0;i--){
            //             //     if(state.weekList[i].workers.includes(data.name))
            //             //     {
            //             //         dayWorksCount+=1
            //             //         firstWorkDay = i
            //             //         console.log(dayWorksCount)
            //             //     }else {
            //             //         break
            //             //     }
            //             // }
            //             // console.log("----------------")
            //             //
            //             // for(let i=firstWorkDay-1;i>=0;i--){
            //             //     if(!state.weekList[i].workers.includes(data.name))
            //             //     {
            //             //         dayUnworksCount+=1
            //             //     }else {
            //             //         break
            //             //     }
            //             // }
            let daysWork = 0;
            let daysUnwork = 0;
            if(workerData.timetable.toString()==="2/2"){
                daysWork=2
                daysUnwork=2
            }else {
                daysWork=5
                daysUnwork=2
            }

            let dayWorksCount = 1
            let dayUnworksCountPrevious = 0
            let dayUnworksCountNext = 0

            let lastWorkDay = data.dayIndex+7
            let firstWorkDay = data.dayIndex+7
            //let addedDayIndex = data.dayIndex+7
            // TODO: fix bug with 1st work day because it sets wrong index of item in longWeekList

            let longWeeksList = [].concat(state.previousWeekList,state.weekList).concat(state.nextWeekList)

            console.log(state.previousWeekList," previous")
            console.log(state.weekList," curr")
            console.log(state.nextWeekList," next")

            console.log(longWeeksList," - long week list")

            let dayIndex = data.dayIndex+7
            let nextWorkDaysEnded = false
            let previousWorkDaysEnded = false
            for(let i=0;i<daysWork;i++){
                if(longWeeksList[dayIndex+i+1].workers.includes(data.name))
                {
                    dayWorksCount+=1
                }else {
                    lastWorkDay=dayIndex+i
                    nextWorkDaysEnded = true
                }
                if(longWeeksList[dayIndex-i-1].workers.includes(data.name))
                {
                    dayWorksCount+=1
                }else {
                    firstWorkDay=dayIndex-i
                    previousWorkDaysEnded = true
                }
                if(previousWorkDaysEnded&&nextWorkDaysEnded){
                    console.log(" w days ended")
                    break
                }

            }


            let nextUnworksEnough = false
            let previousUnworksEnougth = false
            for(let i=0;i<daysUnwork;i++){
                //console.log(i,longWeeksList[firstWorkDay-i-1],firstWorkDay-i-1," - days should unwork")
                if(!longWeeksList[lastWorkDay+i+1].workers.includes(data.name))
                {
                    dayUnworksCountNext+=1
                }else {
                    nextUnworksEnough = true
                }
                if(!longWeeksList[firstWorkDay-i-1].workers.includes(data.name))
                {
                    dayUnworksCountPrevious+=1
                }else {
                    previousUnworksEnougth = true
                }
                if(nextUnworksEnough&&previousUnworksEnougth){
                    console.log(" unworks enouth")
                    break
                }
            }



            console.log(daysUnwork,daysWork," -daysUnwork,daysWork")
            console.log(dayUnworksCountPrevious,dayWorksCount,dayUnworksCountNext,
                "-dayUnworksCountPrevious,daysWorksCount,dayUnworksCountNext")
            console.log(lastWorkDay,firstWorkDay,' - lastWorkDay,firstWorkDay')

            if(dayWorksCount>daysWork){
                alert('слишком много дней он работает')
            }

            if((dayUnworksCountPrevious<daysUnwork)||(dayUnworksCountNext<daysUnwork)){
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
