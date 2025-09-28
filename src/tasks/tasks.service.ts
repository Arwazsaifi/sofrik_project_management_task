import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Task, TaskDocument } from "./schemas/task.schema";
import { CreateTaskDto, UpdateTaskDto } from "./dto/task.dto";

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({
      ...createTaskDto,
      userId,
    });
    return createdTask.save();
  }

  async findAll(projectId: string, userId: string): Promise<Task[]> {
    return this.taskModel.find({ projectId, userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new NotFoundException("Task not found");
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new NotFoundException("Task not found");
    }

    Object.assign(task, updateTaskDto);
    return task.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException("Task not found");
    }
  }

  async findByStatus(status: string, userId: string): Promise<Task[]> {
    return this.taskModel.find({ status, userId }).exec();
  }
}
