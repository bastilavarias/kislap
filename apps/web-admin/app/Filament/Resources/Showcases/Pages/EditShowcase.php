<?php

namespace App\Filament\Resources\Showcases\Pages;

use App\Filament\Resources\Showcases\ShowcaseResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditShowcase extends EditRecord
{
    protected static string $resource = ShowcaseResource::class;

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
