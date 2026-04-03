<?php

namespace App\Filament\Resources\ParsedFiles\Pages;

use App\Filament\Resources\ParsedFiles\ParsedFileResource;
use Filament\Resources\Pages\ListRecords;

class ListParsedFiles extends ListRecords
{
    protected static string $resource = ParsedFileResource::class;
}
