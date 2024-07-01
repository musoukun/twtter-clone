import mongoose, { Document, Schema } from "mongoose";

export interface IPost extends Document {
	content: string;
	author: mongoose.Types.ObjectId;
	likes: mongoose.Types.ObjectId[];
	replies: {
		content: string;
		author: mongoose.Types.ObjectId;
		createdAt: Date;
	}[];
	createdAt: Date;
	updatedAt: Date;
}

const PostSchema: Schema = new Schema(
	{
		content: { type: String, required: true },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
		likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
		replies: [
			{
				content: { type: String, required: true },
				author: {
					type: Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model<IPost>("Post", PostSchema);
