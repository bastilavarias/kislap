<?php

namespace App\Filament\Resources\HelpInquiries\Pages;

use App\Filament\Resources\HelpInquiries\HelpInquiryResource;
use Filament\Resources\Pages\EditRecord;
use Filament\Support\Enums\Width;

class EditHelpInquiry extends EditRecord
{
    protected static string $resource = HelpInquiryResource::class;

    protected Width | string | null $maxContentWidth = Width::SixExtraLarge;

    protected function getHeaderActions(): array
    {
        return [];
    }
}
