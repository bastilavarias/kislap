<?php

namespace App\Filament\Resources\Portfolios;

use App\Filament\Resources\Portfolios\Pages\CreatePortfolio;
use App\Filament\Resources\Portfolios\Pages\EditPortfolio;
use App\Filament\Resources\Portfolios\Pages\ListPortfolios;
use App\Filament\Resources\Portfolios\Schemas\PortfolioForm;
use App\Filament\Resources\Portfolios\Tables\PortfoliosTable;
use App\Models\Portfolio;
use BackedEnum;
use App\Filament\Resources\BaseResource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class PortfolioResource extends BaseResource
{
    protected static ?string $model = Portfolio::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-user-circle';

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
        return PortfolioForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PortfoliosTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            RelationManagers\WorkExperiencesRelationManager::class,
            RelationManagers\EducationRelationManager::class,
            RelationManagers\ShowcasesRelationManager::class,
            RelationManagers\ShowcaseTechnologiesRelationManager::class,
            RelationManagers\SkillsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPortfolios::route('/'),
            'create' => CreatePortfolio::route('/create'),
            'edit' => EditPortfolio::route('/{record}/edit'),
        ];
    }
}
