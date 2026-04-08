<?php

namespace App\Filament\Resources\Portfolios\Pages;

use App\Filament\Resources\Portfolios\PortfolioResource;
use Filament\Resources\Pages\CreateRecord;
use Filament\Support\Enums\Width;

class CreatePortfolio extends CreateRecord
{
    protected static string $resource = PortfolioResource::class;

    protected Width | string | null $maxContentWidth = Width::SixExtraLarge;
}
