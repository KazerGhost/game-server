import mongoose, {Model, Schema} from "mongoose";

interface IReview {
    reviewer: string;
    reviewText: string;
    rating: number;
    date: Date;
}

interface IGame {
    title: string;
    developer: string;
    genre: string;
    price: number;
    rating: number;
    reviews: IReview[];
}

const ReviewSchema = new Schema<IReview>({
    reviewer: {
        type: String,
        required: [true, 'Reviewer required']
    },
    reviewText: {
        type: String,
        required: [true, 'Review text required'],
        minLength: 10
    },
    rating: {
        type: Number,
        required: [true, 'Rating required'],
        min: 0,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    }

});


const GameSchema = new Schema<IGame>({
    title: { type: String, required:[true, 'Title required'] },
    developer: { type: String, required: [true, 'developer required'] },
    genre: { type: String, required: [true, 'Genre required'] },
    price: { type: Number },
    rating: { type: Number },
    reviews: [ReviewSchema]
});

const Game: Model<IGame> = mongoose.model<IGame>('Game', GameSchema);
export default Game;