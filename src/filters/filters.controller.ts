import { Body, Controller, Post } from '@nestjs/common';
import { CreateFiltersDto } from './dto/filters.dto';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Post()
  create(@Body() createFiltersDto: CreateFiltersDto) {
    return this.filtersService.create(createFiltersDto);
  }
}
