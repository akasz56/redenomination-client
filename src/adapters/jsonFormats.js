// ---------------------------------------------------- Phase
const postPhase = {
    sessionID: 1,
    phaseType: "phaseType",
    timer: "timer",
}

const getPhase = {
    phaseID: 1,
    sessionID: 1,
    phaseType: "phaseType",
    timer: "timer",
    timeCreated: "timeCreated",
    timeLastRun: "timeLastRun"
}

// ---------------------------------------------------- Session
const postSession = {
    simulationID: 1,
    sessionType: "sessionType",
    timer: "timer",
    timeCreated: "timeCreated",
    timeLastRun: "timeLastRun"
}

const getSession = {
    sessionID: 1,
    simulationID: 1,
    sessionType: "sessionType",
    timer: "timer",
    timeCreated: "timeCreated",
    timeLastRun: "timeLastRun",
    phases: [getPhase,
        getPhase,
        getPhase]
}

// ---------------------------------------------------- Simulation
const postSimulation = {
    simulationType: "simulationType",
    goodsType: "goodsType",
    goodsName: "goodsName",
    goodsPic: "goodsPic",
    inflationType: "inflationType",
    participantNumber: "participantNumber",
    timer: "timer",
    seller: [
        { unitCost: "unitCost" },
        { unitCost: "unitCost" },
        { unitCost: "unitCost" },
    ],
    buyer: [
        { unitValue: "unitValue" },
        { unitValue: "unitValue" },
        { unitValue: "unitValue" },
    ]
}

const getSimulation = {
    simulationID: 1,
    token: "token",
    simulationType: "simulationType",
    goodsType: "goodsType",
    goodsName: "goodsName",
    goodsPic: "goodsPic",
    inflationType: "inflationType",
    participantNumber: "participantNumber",
    timer: "timer",
    timeCreated: "timeCreated",
    sessions: [getSession,
        getSession,
        getSession],
    summary: {
        avgTrxPic: "avgTrxPic",
    }
}

// ---------------------------------------------------- Bargain
const postBargain = {
    phaseID: 1,
    buyerID: 1,
    sellerID: 1,
    price: "price",
    postedBy: "postedBy"
}

const getBargain = {
    bargainID: 1,
    phaseID: 1,
    buyerID: 1,
    sellerID: 1,
    price: "price",
    timeCreated: "timeCreated",
    postedBy: "postedBy"
}

// ---------------------------------------------------- Transaction
const postTransaction = {
    buyerID: 1,
    sellerID: 1,
    price: "price",
}

const getTransaction = {
    TransactionID: 1,
    buyerID: 1,
    sellerID: 1,
    price: "price",
    timeCreated: "timeCreated"
}

// ---------------------------------------------------- Seller
const postSeller = {
    simulationID: 1,
    loginToken: "loginToken",
    unitCost: "unitCost"
}
const getSeller = {
    sellerID: 1,
    simulationID: 1,
    loginToken: "loginToken",
    unitCost: "unitCost"
}

// ---------------------------------------------------- Buyer
const postBuyer = {
    simulationID: 1,
    loginToken: "loginToken",
    unitValue: "unitValue"
}
const getBuyer = {
    buyerID: 1,
    simulationID: 1,
    loginToken: "loginToken",
    unitValue: "unitValue"
}


export {
    postSimulation,
    getSimulation,
    postSession,
    getSession,
    postPhase,
    getPhase,
    postBargain,
    getBargain,
    postTransaction,
    getTransaction,
    postSeller,
    getSeller,
    postBuyer,
    getBuyer
};