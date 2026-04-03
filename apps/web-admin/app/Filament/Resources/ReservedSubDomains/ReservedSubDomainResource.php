<?php

namespace App\Filament\Resources\ReservedSubDomains;

use App\Filament\Resources\ReservedSubDomains\Pages\CreateReservedSubDomain;
use App\Filament\Resources\ReservedSubDomains\Pages\EditReservedSubDomain;
use App\Filament\Resources\ReservedSubDomains\Pages\ListReservedSubDomains;
use App\Filament\Resources\ReservedSubDomains\Schemas\ReservedSubDomainForm;
use App\Filament\Resources\ReservedSubDomains\Tables\ReservedSubDomainsTable;
use App\Models\ReservedSubDomain;
use BackedEnum;
use App\Filament\Resources\BaseResource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class ReservedSubDomainResource extends BaseResource
{
    protected static ?string $model = ReservedSubDomain::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-at-symbol';

    protected static string | UnitEnum | null $navigationGroup = 'Publishing';

    public static function form(Schema $schema): Schema
    {
        return ReservedSubDomainForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ReservedSubDomainsTable::configure($table);
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
            'index' => ListReservedSubDomains::route('/'),
            'create' => CreateReservedSubDomain::route('/create'),
            'edit' => EditReservedSubDomain::route('/{record}/edit'),
        ];
    }
}
