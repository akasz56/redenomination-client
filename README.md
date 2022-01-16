# Doing

# API Specification

## Admin

| Method | Route  | Function                        | Auth |
| ------ | ------ | ------------------------------- | ---- |
| POST   | /login | Log in to app as admin/peneliti | -    |

## Simulations

simulationID = "1DA080122_1"

| Method | Route                            | Function                                   | Auth  |
| ------ | -------------------------------- | ------------------------------------------ | ----- |
| POST   | /simulations/                    | Create a simulation                        | Admin |
| GET    | /simulations/                    | Read all simulations                       | Admin |
| GET    | /simulations/:id                 | Read simulation details                    | Admin |
| PUT    | /simulations/:id                 | Update simulation details                  | Admin |
| DELETE | /simulations/:id                 | Delete simulation                          | Admin |
| GET    | /simulations/:id/unit-cost-value | Download unit cost & value                 | Admin |
| GET    | /simulations/:id/bargain-log     | Download Log Tawar-Menawar                 | Admin |
| GET    | /simulations/:id/avg-trx         | Download Rerata jumlah trx                 | Admin |
| GET    | /simulations/:id/avg-price       | Download Rerata harga                      | Admin |
| GET    | /simulations/:id/deal-price-diff | Download Selisih price dgn Unit Value/Cost | Admin |

## Sessions

| Method | Route                                        | Function                                   | Auth  |
| ------ | -------------------------------------------- | ------------------------------------------ | ----- |
| POST   | /simulations/:id/session                     | Add session                                | Admin |
| GET    | /simulations/:id/session                     | Read all sessions                          | Admin |
| GET    | /simulations/:id/session/:id                 | Read session details                       | Admin |
| PUT    | /simulations/:id/session/:id                 | Update session details                     | Admin |
| DELETE | /simulations/:id/session/:id                 | Delete session                             | Admin |
| GET    | /simulations/:id/session/:id/unit-cost-value | Download unit cost & value                 | Admin |
| GET    | /simulations/:id/session/:id/bargain-log     | Download Log Tawar-Menawar                 | Admin |
| GET    | /simulations/:id/session/:id/avg-trx         | Download Rerata jumlah trx                 | Admin |
| GET    | /simulations/:id/session/:id/avg-price       | Download Rerata harga                      | Admin |
| GET    | /simulations/:id/session/:id/deal-price-diff | Download Selisih price dgn Unit Value/Cost | Admin |

## Participants

# Methods
