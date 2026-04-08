<?php

namespace App\Filament\Resources\ParsedFiles;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\ParsedFiles\Pages\ListParsedFiles;
use App\Filament\Resources\ParsedFiles\Tables\ParsedFilesTable;
use App\Models\ParsedFile;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class ParsedFileResource extends BaseResource
{
    protected static ?string $model = ParsedFile::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-document-text';

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
        return ParsedFilesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListParsedFiles::route('/'),
        ];
    }
}
