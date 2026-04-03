<?php

namespace App\Filament\Resources;

use Filament\Resources\Resource;
use Illuminate\Database\Eloquent\Model;

class BaseResource extends Resource
{
    protected static function isSupportUser(): bool
    {
        $user = auth()->user();

        return $user?->role === 'support';
    }

    public static function canCreate(): bool
    {
        return ! static::isSupportUser();
    }

    public static function canEdit(Model $record): bool
    {
        return ! static::isSupportUser();
    }

    public static function canDelete(Model $record): bool
    {
        return ! static::isSupportUser();
    }

    public static function canDeleteAny(): bool
    {
        return ! static::isSupportUser();
    }

    public static function canForceDelete(Model $record): bool
    {
        return ! static::isSupportUser();
    }

    public static function canForceDeleteAny(): bool
    {
        return ! static::isSupportUser();
    }

    public static function canRestore(Model $record): bool
    {
        return ! static::isSupportUser();
    }

    public static function canRestoreAny(): bool
    {
        return ! static::isSupportUser();
    }
}
