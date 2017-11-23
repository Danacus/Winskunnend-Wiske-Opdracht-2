
//FORMULA!!
//connections = 2(amount - 2)
/*
const check = () => {

    for (i = 0; i < iterations; i++) {
        let calc = calculate()
        if (calc) console.log(calc)
        //console.log(networks.length)

        if (!min || calc < min) {
            min = calc
        } 

        network = []
    }

    if (min == 2 * (amount - 2)) {
        console.log(amount + ": " + min)
        console.log("It's true!")
        min = limit
        amount++
        check()
    } else {
        if (iterations < 1000000) {
            iterations *= 10
            min = limit
            check()
        }
        console.log("Done!")
    }
} 


const calculate = () => {
    let computers = []
    let network = []

    for (let i = 0; i < amount; i++) {
        let computer = new Computer(i)
        computers.push(computer)
    }

    let connections = 0
    let counter = 0

    while (connections < min) {
        if (computers.filter(computer => computer.isComplete()).length == computers.length) {
            if (!networks.includes(network)) {
                //console.log(network)
                networks.push(network)
            }
            return connections
        } 
        let source = Math.floor(Math.random() * computers.length)
        let filteredComputers = computers.filter(computer => {
          if (computer.data == source.data) return false
          else return true
        })

        let target = Math.floor(Math.random() * filteredComputers.length)

        if (filteredComputers.length > 0) {
            computers[source].connect(filteredComputers[target])
            network.push(`${computers[source].id} - ${filteredComputers[target].id}`)
            connections++
        }

        counter++
    }
}

const calculate2 = () => {
    let computers = []
    let network = []

    for (let i = 0; i < amount; i++) {
        let computer = new Computer(i)
        computers.push(computer)
    }

    let connections = 0
    let counter = 0

    while (true) {
        if (computers.filter(computer => computer.isComplete()).length == computers.length) {
            return connections
        } 

        let source
        let target

        if (counter > amount) {
            source = counter % amount
            target = (counter + 1) % amount
        } else {
            source = (counter + 1) % amount
            target = (counter + 2) % amount
        }
        
        computers[source].connect(computers[target])
        connections++
        counter++
    }
}*/

//n - 1 + 1 + (n - 4) = 2n - 4 = 2(n - 2)

import vis from 'vis'

let computers = []
let amount = 10
let nodes
let edges
let network
let selected

const updateComputers = () => {
    computers = []
    amount = parseInt(document.getElementById("computers").value) || 0
    for (let i = 0; i < amount; i++) {
        computers.push(new Computer(i))
    }

    nodes = new vis.DataSet()
    edges = new vis.DataSet()
    nodes.add(computers.map(computer => ({
        id: computer.id,
        label: `${computer.id}: ${JSON.stringify(Array.from(computer.data).sort())}`,
        x: (computer.id % 2) * 500,
        y: Math.floor(computer.id / 2) * 100
    })))

    let container = document.getElementById('container');
    let data = {
        nodes: nodes,
        edges: edges
    }
    let options = {
        physics: {
            enabled: false
        }
    }
    network = new vis.Network(container, data, options)

    network.on("click",  params => {
        params.event = "[original event]"
        if (!selected) {
            selected = params.nodes[0]
        } else {
            computers[selected].connect(computers[params.nodes[0]])
            console.log(computers.map(computer => computer.data.size).reduce((total, num) => total + num))
            let color1
            if (computers[selected].isComplete()) color1 = 'red'
            let color2
            if (computers[params.nodes[0]].isComplete()) color2 = 'red'
            nodes.update({
                id: selected,
                label: `${computers[selected].id}: ${JSON.stringify(Array.from(computers[selected].data).sort())}`,
                color: color1
            })
            nodes.update({
                id: params.nodes[0],
                label: `${computers[params.nodes[0]].id}: ${JSON.stringify(Array.from(computers[params.nodes[0]].data).sort())}`,
                color: color2
            })
            edges.add({
                id: edges.length,
                label: (edges.length + 1).toString(),
                from: selected,
                to: params.nodes[0]
            })
            selected = undefined
        }
    })
}

window.onload = () => {
    updateComputers()
    document.getElementById("updateComputers").onclick = () => updateComputers()
}

class Computer {
    constructor(id) {
        this.id = id
        this.data = new Set([id])
    }

    connect(computer) {
        let newData = new Set([...this.data, ...computer.data])
        this.data = newData
        computer.data = newData
        console.log("connect")
    }

    isComplete() {
        return (this.data.size == amount)
    }
}
