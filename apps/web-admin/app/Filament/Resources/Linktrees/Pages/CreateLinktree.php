<?php

namespace App\Filament\Resources\Linktrees\Pages;

use App\Filament\Resources\Linktrees\LinktreeResource;
use Filament\Resources\Pages\CreateRecord;
use Filament\Support\Enums\Width;

class CreateLinktree extends CreateRecord
{
    protected static string $resource = LinktreeResource::class;

    protected Width | string | null $maxContentWidth = Width::SixExtraLarge;
}
