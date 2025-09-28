import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  })
  status: string;

  @Prop({ type: Date })
  dueDate: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: "Project" })
  projectId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
