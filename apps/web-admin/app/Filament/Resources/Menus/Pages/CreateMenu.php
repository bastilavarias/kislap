<?php

namespace App\Filament\Resources\Menus\Pages;

use App\Filament\Resources\Menus\MenuResource;
use Filament\Resources\Pages\CreateRecord;
use Filament\Support\Enums\Width;

class CreateMenu extends CreateRecord
{
    protected static string $resource = MenuResource::class;

    protected Width | string | null $maxContentWidth = Width::SixExtraLarge;
}
