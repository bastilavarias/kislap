<?php

namespace App\Filament\Resources\Showcases;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\Showcases\Pages\CreateShowcase;
use App\Filament\Resources\Showcases\Pages\EditShowcase;
use App\Filament\Resources\Showcases\Pages\ListShowcases;
use App\Filament\Resources\Showcases\Schemas\ShowcaseForm;
use App\Filament\Resources\Showcases\Tables\ShowcasesTable;
use App\Models\Showcase;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class ShowcaseResource extends BaseResource
{
    protected static ?string $model = Showcase::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-sparkles';

    protected static string | UnitEnum | null $navigationGroup = 'Moderation';

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function canViewAny(): bool
    {
        return false;
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function form(Schema $schema): Schema
    {
        return ShowcaseForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ShowcasesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListShowcases::route('/'),
            'create' => CreateShowcase::route('/create'),
            'edit' => EditShowcase::route('/{record}/edit'),
        ];
    }
}
