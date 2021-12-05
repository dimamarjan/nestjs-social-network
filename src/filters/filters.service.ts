import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateFiltersDto } from './dto/filters.dto';
import { Filters } from './model/filters.model';

@Injectable()
export class FiltersService {
  constructor(
    @InjectModel(Filters) private filtersRepository: typeof Filters,
  ) {}

  async create(createFiltersDto: CreateFiltersDto) {
    return await this.filtersRepository.create(createFiltersDto);
  }
}
