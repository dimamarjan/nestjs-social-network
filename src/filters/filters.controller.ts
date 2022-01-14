import { Body, Controller, Post } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { CreateFiltersDto } from './dto/filters.dto';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @ApiExcludeEndpoint()
  @Post()
  create(@Body() createFiltersDto: CreateFiltersDto) {
    return this.filtersService.create(createFiltersDto);
  }
}
