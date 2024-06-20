import mongoose, {Schema, Document} from 'mongoose';

export interface NewsletterDocument extends Document {
    title: string,
    content: string,
    createdAt: Date
}

const NewsletterSchema: Schema<NewsletterDocument> = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    createdAt: {
       type: Date,
       default: Date.now
    },
})

const Newsletter = (mongoose.models.Newsletter) || (mongoose.model<NewsletterDocument>('NewsLetter',NewsletterSchema))

export default Newsletter;