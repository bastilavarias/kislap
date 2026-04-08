<?php

namespace App\Filament\Resources\Portfolios\Pages;

use App\Filament\Resources\Portfolios\PortfolioResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Enums\Width;

class EditPortfolio extends EditRecord
{
    protected static string $resource = PortfolioResource::class;

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
