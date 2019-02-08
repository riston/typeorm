import "reflect-metadata";
import {closeTestingConnections, createTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import { Photo } from './entity/Photo';
import { User } from './entity/User';

describe("github issues > unknown update done by save", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        subscribers: [__dirname + "/subscriber/*{.js,.ts}"],
        enabledDrivers: ["postgres"],
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("should save without errors", () => Promise.all(connections.map(async function(connection) {
        const user = new User();
        user.name = "John";
        await connection.manager.save(user);

        const photo2 = new Photo();
        photo2.url = "me-and-bears.jpg";
        photo2.user_id = user.id;
        await connection.manager.save(photo2);

        const photo1 = new Photo();
        photo1.url = "me.jpg";
        photo1.user_id = user.id;
        await connection.manager.save(photo1);

        // In case one of the photos is missing
        const firstPhoto = await connection.manager.findOne(Photo, { id: 1 });
        const firstUser = await connection.manager.findOne(User, {}, { relations: ['photos']});
        if (firstUser === undefined || firstPhoto === undefined) {
            throw Error('Not found entity');
        }
        firstPhoto.url = 'next.jpg';
        firstPhoto.user_id = user.id;

        firstUser.photos = [firstPhoto];
        await connection.manager.save(firstUser);

        console.log(await connection.manager.find(User, { relations: ['photos'] }));
    })));

});
