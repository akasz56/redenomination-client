export const phasePre = {
    trxOccurrence: 4,
    avgTrxPrices: 4250,
    trxPrices: [5000, 8000, 3000, 1000]
}

export const phaseTransition = {
    trxOccurrence: 4,
    avgTrxPrices: 4250,
    trxPrices: [1000, 8000, 7000, 1000]
}

export const phasePost = {
    trxOccurrence: 4,
    avgTrxPrices: 4500,
    trxPrices: [3000, 1000, 7000, 7000]
}

export const sessionSummary = {
    avgTrxOccurrence: 4,
    avgTrxPrices: 4333,
    phasePre: phasePre,
    phaseTransition: phaseTransition,
    phasePost: phasePost
}

export const simulationSummary = {
    avgTrxOccurrence: "",
    avgTrxPrices: "",
    sessions: [sessionSummary, sessionSummary, sessionSummary]
}

export const allSimulationSummary = [simulationSummary, simulationSummary, simulationSummary]