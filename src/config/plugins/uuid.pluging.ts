import { v4 as uuidv4 } from 'uuid'

export class Uuid {
    static generate = () => uuidv4();
}