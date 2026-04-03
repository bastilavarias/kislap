<?php

namespace App\Filament\Resources\ReservedSubDomains\Pages;

use App\Filament\Resources\ReservedSubDomains\ReservedSubDomainResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListReservedSubDomains extends ListRecords
{
    protected static string $resource = ReservedSubDomainResource::class;

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
