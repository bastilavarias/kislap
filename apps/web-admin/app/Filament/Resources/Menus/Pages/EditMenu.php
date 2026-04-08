<?php

namespace App\Filament\Resources\Menus\Pages;

use App\Filament\Resources\Menus\MenuResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Enums\Width;

class EditMenu extends EditRecord
{
    protected static string $resource = MenuResource::class;

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
