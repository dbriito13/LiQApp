import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor(private searchService: SearchService) {}

    @Get()
    async search(@Query('query') query: string){
        if (!query) return [];
        return this.searchService.searchProducts(query);
    }
}
