<?php

namespace App\Filament\Resources\PageActivities;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\PageActivities\Pages\ListPageActivities;
use App\Filament\Resources\PageActivities\Tables\PageActivitiesTable;
use App\Models\PageActivity;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class PageActivityResource extends BaseResource
{
    protected static ?string $model = PageActivity::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-eye';

    protected static string | UnitEnum | null $navigationGroup = 'Operations';

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function canViewAny(): bool
    {
        return false;
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canEdit(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return false;
    }

    public static function canDelete(\Illuminate\Database\Eloquent\Model $record): bool
    {
        return false;
    }

    public static function canDeleteAny(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return $schema;
    }

    public static function table(Table $table): Table
    {
        return PageActivitiesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPageActivities::route('/'),
        ];
    }
}
