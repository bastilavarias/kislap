<?php

namespace App\Support;

use Filament\Actions\Action;

class FormUrlPreviewAction
{
    public static function make(string $name = 'previewUrl'): Action
    {
        return Action::make($name)
            ->icon('heroicon-o-arrow-top-right-on-square')
            ->tooltip('Open URL')
            ->url(
                fn ($state): ?string => filled($state) ? (string) $state : null,
                shouldOpenInNewTab: true,
            )
            ->visible(fn ($state): bool => filled($state));
    }
}
