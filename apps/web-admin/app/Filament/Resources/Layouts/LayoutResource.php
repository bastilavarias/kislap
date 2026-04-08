<?php

namespace App\Filament\Resources\Layouts;

use App\Filament\Resources\Layouts\Pages\CreateLayout;
use App\Filament\Resources\Layouts\Pages\EditLayout;
use App\Filament\Resources\Layouts\Pages\ListLayouts;
use App\Filament\Resources\Layouts\Schemas\LayoutForm;
use App\Filament\Resources\Layouts\Tables\LayoutsTable;
use App\Models\Layout;
use BackedEnum;
use App\Filament\Resources\BaseResource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class LayoutResource extends BaseResource
{
    protected static ?string $model = Layout::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-squares-2x2';

    protected static string | UnitEnum | null $navigationGroup = 'Publishing';

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function canViewAny(): bool
    {
        return false;
    }

    public static function form(Schema $schema): Schema
    {
        return LayoutForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LayoutsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLayouts::route('/'),
            'create' => CreateLayout::route('/create'),
            'edit' => EditLayout::route('/{record}/edit'),
        ];
    }
}
