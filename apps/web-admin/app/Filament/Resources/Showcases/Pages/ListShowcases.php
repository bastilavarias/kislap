<?php

namespace App\Filament\Resources\Showcases\Pages;

use App\Filament\Resources\Showcases\ShowcaseResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListShowcases extends ListRecords
{
    protected static string $resource = ShowcaseResource::class;

    protected function getHeaderActions(): array
    {
        if (auth()->user()?->role === 'support') {
            return [];
        }

        return [
            CreateAction::make(),
        ];
    }
}
