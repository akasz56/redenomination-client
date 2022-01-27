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
