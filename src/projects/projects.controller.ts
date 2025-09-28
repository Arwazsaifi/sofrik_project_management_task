import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto, UpdateProjectDto, ProjectQueryDto } from "./dto/project.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("projects")
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create(createProjectDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query() query: ProjectQueryDto) {
    if (query.page || query.limit || query.search || query.status || query.sortBy || query.sortOrder) {
      return this.projectsService.findAllWithPagination(req.user.userId, query);
    }
    return this.projectsService.findAll(req.user.userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Request() req) {
    return this.projectsService.findOne(id, req.user.userId);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    return this.projectsService.update(id, updateProjectDto, req.user.userId);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Request() req) {
    return this.projectsService.remove(id, req.user.userId);
  }
}
