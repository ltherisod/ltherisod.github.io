if(document.title == "TGIF | Home"){
    document.getElementById("readLess").addEventListener('click', function (e){
        this.innerText = this.innerText == 'Read More' ? 'View Less' : 'Read More'
    })
}else{
    const dataBase = document.title.includes("Senate") ? "senate" : "house"
document.getElementById("loader").style.display = "block"
let init = {
    headers:{
        "X-API-key":" nuA2NOq7vlhylM6UzgBUkPhyhfuFqKPTZcSg5yXv"

    }
}
fetch(`https://api.propublica.org/congress/v1/113/${dataBase}/members.json`, init)
    .then (res => res.json())
    .then(json =>{
        let mainData = [...json.results[0].members]

        allData(mainData)
    })

    .catch(error =>console.log(error))
}



    function allData (data){
    document.getElementById("loader").style.display = "none"
    let members = JSON.parse(JSON.stringify(data))

    if(document.title == "TGIF | House" || document.title == "TGIF | Senate"){            
    let tableBody = document.getElementById("tableBody") ? document.getElementById("tableBody"): document.getElementById("tableBodySenate")

    var filterParty = ["R", "ID", "D"]
    let filterSelect = "all"
    var finalMembers = []


    function allFilters (){  
        
        if (filterSelect == "all"){
            finalMembers = members
        }else {
            finalMembers = members.filter(member => member.state == filterSelect )
        }

        finalMembers = finalMembers.filter(member => filterParty.includes(member.party) )

    }

    function addInfo() {
        tableBody.innerHTML= ""
        allFilters ()
        finalMembers.forEach(member=> {
            let tableRow = document.createElement("tr")
            let tableData = document.createElement("td")
            let bond = document.createElement ("a")
            tableData.appendChild(bond)
            bond.href=member.url
            bond.target="_blank"
            bond.innerText = `${member.last_name} , ${member.first_name} ${member.middle_name || ""}`
            tableRow.appendChild(tableData)
            tableData = document.createElement("td")
            tableData.innerText = member.party
            tableRow.appendChild(tableData)
            tableData = document.createElement("td")
            tableData.innerText = member.state
            tableRow.appendChild(tableData)
            tableData = document.createElement("td")
            tableData.innerText = member.seniority
            tableRow.appendChild(tableData)
            tableData = document.createElement("td")
            tableData.innerText = member.votes_with_party_pct + "%"
            tableRow.appendChild(tableData)
            tableBody.appendChild(tableRow)

        })
    }

    addInfo()


    let states=[]

    states.sort()

    members.forEach(member => {
        if(!states.includes(member.state)){
            states.push(member.state)
        }
    })

    let stateSelect=document.getElementById("filterStates")

    states.forEach(state => {
        let statesData= document.createElement("option")
        statesData.innerText=state
        statesData.value = state
        stateSelect.appendChild(statesData)
    })

    document.getElementById("filterStates").addEventListener('change', (e) => {
        let stateElected= e.target.value
        filterSelect=stateElected
        addInfo()
    })

    let parties = document.getElementsByName("party")
    parties = Array.from(parties)
    parties.forEach(partyAff => {
        partyAff.addEventListener('change', (e) => {
            let partyInput = e.target.value 
            let partyChecked = e.target.checked
            if(filterParty.includes(partyInput) && !partyChecked){
                filterParty = filterParty.filter(party => party !== partyInput)
            }else if (!filterParty.includes(partyInput) && partyChecked){
                filterParty.push(partyInput)
            
            }
            addInfo()
        })
    
    })

        }else{
            let statistics = {
                democrats:{
                    name:"Democrats",
                    number:0,
                    avregeVotes:0,
                    avregeMissedVotes:0
                },
                
                republicans:{
                    name:"Republicans",
                    number:0,
                    avregeVotes:0,
                    avregeMissedVotes:0
                },
                
                independents:{
                    name:"Independents",
                    number: 0,
                    avregeVotes:0,
                    avregeMissedVotes:0
                },
                total:{
                    name:"Total",
                    totalRepresentatives:0,
                    avregeVotes:"-",
                    avregeMissedVotes:"-"
                },
                mostLoyal:[],
                leastLoyal:[],
                mostEngaged:[],
                leastEngaged: []
            }
            
            statistics.democrats = members.filter((member => member.party === "D"))
            statistics.republicans = members.filter((member => member.party === "R"))
            statistics.independents = members.filter((member => member.party === "ID"))
            statistics.democrats.number = statistics.democrats.length
            statistics.republicans.number = statistics.republicans.length
            statistics.independents.number = statistics.independents.length
            statistics.total.totalRepresentatives = members.length
            
            
            statistics.democrats.avregeVotes = (members.reduce((total,member)=> {
            let percent = member.party === "D" ? member.votes_with_party_pct:0
                return total + percent
            }, 0)/statistics.democrats.length)
            
            statistics.republicans.avregeVotes = (members.reduce((total,member)=> {
            let percent = member.party === "R" ? member.votes_with_party_pct :0
                return total + percent
            }, 0)/statistics.republicans.length)

            statistics.democrats.avregeMissedVotes = (members.reduce((total, member)=> {
            let percent = member.party === "D" ? member.missed_votes_pct : 0
                return total + percent
            }, 0)/statistics.democrats.length)
            
            statistics.republicans.avregeMissedVotes = (members.reduce ((total, member)=> {
            let percent = member.party === "R" ? member.missed_votes_pct : 0
                return total + percent
            }, 0)/statistics.republicans.length)
            
            let neatMembers = members.filter(member=>member.total_votes>0)
            
            let membersPercent = Math.ceil(neatMembers.length*0.1)

            statistics.leastEngaged = neatMembers.sort((a,b)=>b.missed_votes_pct - a.missed_votes_pct).filter(member => member.missed_votes_pct >= neatMembers[membersPercent-1].missed_votes_pct )
            statistics.mostEngaged = neatMembers.sort((a,b)=>a.missed_votes_pct - b.missed_votes_pct).filter(member => member.missed_votes_pct <= neatMembers [membersPercent-1].missed_votes_pct)
            statistics.mostLoyal = neatMembers.sort((a,b)=> b.votes_with_party_pct - a.votes_with_party_pct).filter(member => member.votes_with_party_pct >= neatMembers[membersPercent-1].votes_with_party_pct)
            statistics.leastLoyal = neatMembers.sort((a,b)=> a.votes_with_party_pct - b.votes_with_party_pct).filter(member => member.votes_with_party_pct<= neatMembers[membersPercent-1].votes_with_party_pct)
            
            let atGlance = [
                {name: "Republicans", number : statistics.republicans.number, avregeVotes : `${statistics.republicans.avregeVotes.toFixed(2)} %`, avregeMissedVotes : `${statistics.republicans.avregeMissedVotes.toFixed(2)} %`},
                {name: "Democrats", number : statistics.democrats.number, avregeVotes :`${statistics.democrats.avregeVotes.toFixed(2)} %`, avregeMissedVotes : `${statistics.democrats.avregeMissedVotes.toFixed(2)} %`},
                {name: "Independents", number : statistics.independents.number, avregeVotes : statistics.independents.avregeVotes, avregeMissedVotes : statistics.independents.avregeMissedVotes},
                {name: "Total", number:statistics.total.totalRepresentatives, avregeVotes:statistics.total.avregeVotes, avregeMissedVotes:statistics.total.avregeMissedVotes}           
            ]

            if(document.title.includes("Attendance")){
                completeBigTables(statistics,["leastEngaged"], "TableLeast")
                completeBigTables (statistics,["mostEngaged"], "TableMost")
                glanceTable(atGlance,"tableGlance")
            }else{
                completeBigTables(statistics,["mostLoyal"],"mostLoyalTable")
                completeBigTables(statistics,["leastLoyal"],"leastLoyalTable")
                glanceTable(atGlance,"GlanceParty")
            }
            
            function completeBigTables (object, property, father ) {
                if (object[property] == statistics["leastEngaged"] || object[property] == statistics["mostEngaged"] ){
                object[property].forEach(info =>{
                    let tRow = document.createElement("tr")
                    let tData = document.createElement("td")
                    tData.innerHTML = `<a href="${info.url}" target= "_blank">${info.last_name} , ${info.first_name} ${info.middle_name || ""}`
                    tRow.appendChild(tData)
                    tData=document.createElement("td")
                    tData.innerHTML = `<td> ${info.missed_votes} </td>`
                    tRow.appendChild(tData)
                    tData=document.createElement("td")
                    tData.innerHTML= `<td>${info.missed_votes_pct.toFixed(2)} % </td>`
                    tRow.appendChild(tData)
                    document.getElementById(father).appendChild(tRow)
                })
                }else {
                object[property].forEach(info =>{
                    let tRow = document.createElement("tr")
                    let tData = document.createElement("td")
                    tData.innerHTML = `<a href="${info.url}" target= "_blank">${info.last_name} , ${info.first_name} ${info.middle_name || ""}`
                    tRow.appendChild(tData)
                    tData=document.createElement("td")
                    tData.innerHTML = `<td> ${Math.round((info.total_votes - info.missed_votes) *(info.votes_with_party_pct /100)) } </td>`
                    tRow.appendChild(tData)
                    tData=document.createElement("td")
                    tData.innerHTML= `<td>${info.votes_with_party_pct.toFixed(2)} %</td>`
                    tRow.appendChild(tData)
                    document.getElementById(father).appendChild(tRow)
                    
                })
                }
            
            }
            function glanceTable (array,father){
                if(document.title.includes("Attendance")){
                    array.forEach(obj =>{
                        let tRow = document.createElement("tr")
                        tRow.innerHTML= `
                            <td>${obj.name}</td>
                            <td>${obj.number || "-"}</td>
                            <td>${obj.avregeMissedVotes || "-"}</td>
                            `
                        document.getElementById(father).appendChild(tRow)
                    })

                }else{
                    array.forEach(obj =>{
                        let tRow = document.createElement("tr")
                        tRow.innerHTML= `
                            <td>${obj.name}</td>
                            <td>${obj.number || "-"}</td>
                            <td>${obj.avregeVotes || "-"}</td>
                            `
                        document.getElementById(father).appendChild(tRow)
                    })
                }
            }
                  
        }
    }



