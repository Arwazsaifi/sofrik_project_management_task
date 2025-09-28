import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Project, ProjectDocument } from "./schemas/project.schema";
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto, PaginatedProjectsResponse } from "./dto/project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: string,
  ): Promise<Project> {
    const createdProject = new this.projectModel({
      ...createProjectDto,
      userId,
    });
    return createdProject.save();
  }

  async findAll(userId: string): Promise<Project[]> {
    return this.projectModel.find({ userId }).exec();
  }

  async findAllWithPagination(
    userId: string,
    query: ProjectQueryDto,
  ): Promise<PaginatedProjectsResponse> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;
    
    const filter: any = { userId };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      filter.status = status;
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      this.projectModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.projectModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id, userId }).exec();
    if (!project) {
      throw new NotFoundException("Project not found");
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    userId: string,
  ): Promise<Project> {
    const project = await this.projectModel.findOne({ _id: id, userId }).exec();
    if (!project) {
      throw new NotFoundException("Project not found");
    }

    Object.assign(project, updateProjectDto);
    return project.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.projectModel
      .deleteOne({ _id: id, userId })
      .exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException("Project not found");
    }
  }
}
