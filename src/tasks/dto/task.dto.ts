import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsIn,
  IsDateString,
} from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsIn(["todo", "in-progress", "done"])
  status?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsIn(["todo", "in-progress", "done"])
  status?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
