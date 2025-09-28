import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    required: true,
    enum: ["active", "completed"],
    default: "active",
  })
  status: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
