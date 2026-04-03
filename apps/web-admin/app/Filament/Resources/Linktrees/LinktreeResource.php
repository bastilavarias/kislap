<?php

namespace App\Filament\Resources\Linktrees;

use App\Filament\Resources\Linktrees\Pages\CreateLinktree;
use App\Filament\Resources\Linktrees\Pages\EditLinktree;
use App\Filament\Resources\Linktrees\Pages\ListLinktrees;
use App\Filament\Resources\Linktrees\Schemas\LinktreeForm;
use App\Filament\Resources\Linktrees\Tables\LinktreesTable;
use App\Models\Linktree;
use BackedEnum;
use App\Filament\Resources\BaseResource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class LinktreeResource extends BaseResource
{
    protected static ?string $model = Linktree::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-link';

    protected static string | UnitEnum | null $navigationGroup = 'Publishing';

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }

    public static function form(Schema $schema): Schema
    {
        return LinktreeForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LinktreesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\LinktreeSectionsRelationManager::class,
            RelationManagers\LinktreeLinksRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLinktrees::route('/'),
            'create' => CreateLinktree::route('/create'),
            'edit' => EditLinktree::route('/{record}/edit'),
        ];
    }
}
