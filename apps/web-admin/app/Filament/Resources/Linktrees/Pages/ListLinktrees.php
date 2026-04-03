<?php

namespace App\Filament\Resources\Linktrees\Pages;

use App\Filament\Resources\Linktrees\LinktreeResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLinktrees extends ListRecords
{
    protected static string $resource = LinktreeResource::class;

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
