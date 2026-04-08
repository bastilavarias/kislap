<?php

namespace App\Filament\Resources\Linktrees\Pages;

use App\Filament\Resources\Linktrees\LinktreeResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Enums\Width;

class EditLinktree extends EditRecord
{
    protected static string $resource = LinktreeResource::class;

    protected Width | string | null $maxContentWidth = Width::SixExtraLarge;

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
