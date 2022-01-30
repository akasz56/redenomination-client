# Backup

    // function generateSeller(num = 1) {
    //     let sellers = [];
    //     for (let i = 1; i <= num; i++) {
    //         sellers.push({
    //             role: "Penjual " + i,
    //             price: Math.floor(Math.random() * 100) * 100,
    //             // status: "wait"
    //             status: "done"
    //             // status: "decentralized"
    //         })
    //     }
    //     return sellers;
    // }

    // const sellerData = {
    //     simulationType: "simulationType",
    //     goodsType: "Elastis",
    //     goodsName: "Laptop",
    //     inflationType: "Inflasi Tinggi",

    //     phase: "Sebelum Redenominasi",
    //     minPrice: 3700,
    //     maxPrice: 8900,
    //     seller: generateSeller(10),

    //     role: "Penjual",
    //     unitCost: 3700,
    // }

    // const buyerData = {
    //     simulationType: "simulationType",
    //     goodsType: "Elastis",
    //     goodsName: "Laptop",
    //     inflationType: "Inflasi Tinggi",

    //     phase: "Sebelum Redenominasi",
    //     minPrice: 3700,
    //     maxPrice: 8900,
    //     seller: generateSeller(10),

    //     role: "Pembeli",
    //     unitValue: 8900,
    // }

# Ready

CardData = SimulationType, GoodsType, GoodsName, InflationType

| Response from Server | Request to Server |
| -------------------- | ----------------- |
| CardData             | ready()           |
| role                 | cancelReady()     |

# Posted Offer

sellerCardList = roleName, price, status

## Stage 1

| Role   | Response from Server | Request to Server                  |
| ------ | -------------------- | ---------------------------------- |
| Seller | CardData             | bargain(price) /harga kesepakatan/ |
|        | role                 |                                    |
|        | unitCost             |                                    |
| Buyer  | CardData             |                                    |
|        | role                 |                                    |
|        | unitValue            |                                    |

Stage 2 ends after all seller bargained

## Stage 2

| Role   | Response from Server | Request to Server |
| ------ | -------------------- | ----------------- |
| Seller | CardData             |                   |
|        | role                 |                   |
|        | unitCost             |                   |
|        | sellerCardList       |                   |
| Buyer  | CardData             | buySeller(id)     |
|        | role                 |                   |
|        | unitValue            |                   |
|        | sellerCardList       |                   |

# Double Auction

| Response from Server | Request to Server                  |
| -------------------- | ---------------------------------- |
| CardData             | bargain(price) /harga kesepakatan/ |
| maxPrice             |                                    |
| minPrice             |                                    |
| role                 |                                    |
| unitCost/unitValue   |                                    |

# Decentralized

sellerCardList = roleName, price, status

## Stage 1

| Role   | Response from Server | Request to Server                  |
| ------ | -------------------- | ---------------------------------- |
| Seller | CardData             | bargain(price) /harga kesepakatan/ |
|        | role                 |                                    |
|        | unitCost             |                                    |
| Buyer  | CardData             |                                    |
|        | role                 |                                    |
|        | unitValue            |                                    |

Stage 2 ends after all seller bargained

## Stage 2

| Role   | Response from Server | Request to Server |
| ------ | -------------------- | ----------------- |
| Seller | CardData             |                   |
|        | role                 |                   |
|        | unitCost             |                   |
|        | sellerCardList       |                   |
| Buyer  | CardData             | buySeller(id)     |
|        | role                 |                   |
|        | unitValue            |                   |
|        | sellerCardList       |                   |
