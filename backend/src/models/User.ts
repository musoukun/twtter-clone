import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	profilePicture?: string;
	followers: mongoose.Types.ObjectId[];
	following: mongoose.Types.ObjectId[];
	comparePassword(candidatePassword: string): Promise<boolean>;
	avatar?: string;
}

const UserSchema: Schema = new Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePicture: { type: String },
		followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
		following: [{ type: Schema.Types.ObjectId, ref: "User" }],
		avatar: { type: String },
	},
	{ timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

UserSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
