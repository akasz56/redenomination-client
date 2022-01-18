// ---------------------------------------------------- Phase
export const postPhase = {
    sessionID: 1,
    phaseType: "phaseType",
    timer: "timer",
}

export const getPhase = {
    phaseID: 1,
    sessionID: 1,
    phaseType: "phaseType",
    timer: "timer",
    timeCreated: "timeCreated",
    timeLastRun: "timeLastRun"
}

// ---------------------------------------------------- Session
export const postSession = {
    simulationID: 1,
    sessionType: "sessionType",
    timer: "timer",
    timeCreated: "timeCreated",
    timeLastRun: "timeLastRun"
}

export const getSession = {
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
export const postSimulation = {
    simulationType: "Posted Offer",
    goodsType: "Non-Elastis (Beras)",
    goodsName: '',
    goodsPic: '',
    inflationType: "Inflasi Rendah",
    participantNumber: 20,
    timer: 2,
    unitCost: {
        penjual1: "unitCost",
        penjual2: "unitCost",
        penjual3: "unitCost",
    },
    unitValue: {
        pembeli1: "unitValue",
        pembeli2: "unitValue",
        pembeli3: "unitValue",
    }
}

export const getSimulation = {
    simulationID: 1,
    token: "token",
    simulationType: "Posted Offer",
    goodsType: "Non-Elastis (Beras)",
    goodsName: 'asd',
    goodsPic: '',
    inflationType: "Inflasi Rendah",
    participantNumber: 10,
    timer: 2,
    timeCreated: "timeCreated",
    sessions: [getSession,
        getSession,
        getSession],
    summary: {
        avgTrxPic: "avgTrxPic",
    }
}

export const getUnitCostValue = {
    unitCost: {
        penjual1: 1000,
        penjual2: 2000,
        penjual3: 3000,
    },
    unitValue: {
        pembeli1: 4000,
        pembeli2: 5000,
        pembeli3: 6000,
    }
}

// ---------------------------------------------------- Bargain
export const postBargain = {
    phaseID: 1,
    buyerID: 1,
    sellerID: 1,
    price: "price",
    postedBy: "postedBy"
}

export const getBargain = {
    bargainID: 1,
    phaseID: 1,
    buyerID: 1,
    sellerID: 1,
    price: "price",
    timeCreated: "timeCreated",
    postedBy: "postedBy"
}

// ---------------------------------------------------- Transaction
export const postTransaction = {
    buyerID: 1,
    sellerID: 1,
    price: "price",
}

export const getTransaction = {
    TransactionID: 1,
    buyerID: 1,
    sellerID: 1,
    price: "price",
    timeCreated: "timeCreated"
}

// ---------------------------------------------------- Seller
export const postSeller = {
    simulationID: 1,
    loginToken: "loginToken",
    unitCost: "unitCost"
}
export const getSeller = {
    sellerID: 1,
    simulationID: 1,
    loginToken: "loginToken",
    unitCost: "unitCost"
}

// ---------------------------------------------------- Buyer
export const postBuyer = {
    simulationID: 1,
    loginToken: "loginToken",
    unitValue: "unitValue"
}
export const getBuyer = {
    buyerID: 1,
    simulationID: 1,
    loginToken: "loginToken",
    unitValue: "unitValue"
}