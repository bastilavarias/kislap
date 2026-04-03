<?php

namespace App\Filament\Resources\ReservedSubDomains\Pages;

use App\Filament\Resources\ReservedSubDomains\ReservedSubDomainResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditReservedSubDomain extends EditRecord
{
    protected static string $resource = ReservedSubDomainResource::class;

    protected function getHeaderActions(): array
    {
        if (auth()->user()?->role === 'support') {
            return [];
        }

        return [
            DeleteAction::make(),
        ];
    }
}
