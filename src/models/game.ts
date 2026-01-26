import mongoose, {Model, Schema} from "mongoose";

interface IGame {
    title: string;
    developer: string;
    genre: string;
    price: number;
    rating: number;
}

const GameSchema = new Schema<IGame>({
    title: { type: String, required:[true, 'Title required'] },
    developer: { type: String, required: [true, 'developer required'] },
    genre: { type: String, required: [true, 'Genre required'] },
    price: { type: Number },
    rating: { type: Number }
});

const Game: Model<IGame> = mongoose.model<IGame>('Game', GameSchema);
export default Game;