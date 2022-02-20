import { Server, ServerCredentials, loadPackageDefinition } from '@grpc/grpc-js';
import { ServiceClientConstructor, GrpcObject } from '@grpc/grpc-js/build/src/make-client';
import { loadSync } from '@grpc/proto-loader';
import CharacterService from './services/characters';

const PROTO_PATH = `${__dirname}/proto/character.proto`;

console.log(PROTO_PATH);

async function main() {
  const packageDef = loadSync(PROTO_PATH, {});
  const grpcObject: GrpcObject = loadPackageDefinition(packageDef);
  const { characterPackage } = grpcObject as any;
  const constructor = characterPackage.CharacterService as ServiceClientConstructor;

  const { service } = constructor;

  function listCharacters(call: any, callback: any) {
    console.log('call', call);
    console.log('callback', callback);

    return CharacterService.getAllCharacters({ limit: 0, offset: 0, orderBy: null, where: null });
  }

  const server = new Server();

  server.addService(service, {
    listCharacters,
  });

  server.bindAsync('0.0.0.0:3002', ServerCredentials.createInsecure(), (err: Error | null, _bindPort: number) => {
    if (err) {
      throw err;
    }

    console.log(`gRPC:Server:${_bindPort}`, new Date().toLocaleString());
    server.start();
  });
}

main().catch(console.error);
