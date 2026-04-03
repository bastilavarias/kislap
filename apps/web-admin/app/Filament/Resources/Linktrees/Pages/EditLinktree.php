<?php

namespace App\Filament\Resources\Linktrees\Pages;

use App\Filament\Resources\Linktrees\LinktreeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditLinktree extends EditRecord
{
    protected static string $resource = LinktreeResource::class;

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
