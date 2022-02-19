## Blockend
A simple experiment of creating a backend that connects and syncs data from a blockchain smart contract and saves it inside mongodb

### TODO
- [x] NodeJS
- [x] TypeScript
- [ ] RabbitMQ
- [x] MongoDB
- [x] ExpressJS
- [ ] SocketIO
- [x] Docker
- [x] GraphQL
- [x] Apollo Server
- [x] Winston and Morgan
- [ ] Cache
- [ ] Redis
- [ ] gRPC
- [ ] Turbo Repo



### Demo
- http://blockheads.metasekai.xyz/

### Information
- Graphql Endpoint and Playground: http://localhost:3001/v1/graphql/

### Setting up the project
- Clone the repository `git clone git@github.com:adepthq/blockend.git`
- Go to the cloned repository folder `cd blockend`
- Run the blockend api only `docker-compose up --force-recreate --build blockend`
- Optional: Run the indexer `docker-compose up --force-recreate --build indexer`
- Note: to run on the background, attach `-d` at the end of the docker-compose command
- A mongodb instance will run and can be accessed thru `mongodb://root:example@127.0.0.1:27017/`


### Contributions
- Clone the repository `git clone git@github.com:adepthq/blockend.git`
- Go to the cloned repository folder `cd blockend`
- Create a new branch base on what you are working on i.g you want to contribute a feature `git checkout -b feature/＜new-branch＞`
- After working on your branch, create a PR to `develop` branch and tell us about your PR