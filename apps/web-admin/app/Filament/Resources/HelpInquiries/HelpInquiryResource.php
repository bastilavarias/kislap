<?php

namespace App\Filament\Resources\HelpInquiries;

use App\Filament\Resources\BaseResource;
use App\Filament\Resources\HelpInquiries\Pages\EditHelpInquiry;
use App\Filament\Resources\HelpInquiries\Pages\ListHelpInquiries;
use App\Filament\Resources\HelpInquiries\Schemas\HelpInquiryForm;
use App\Filament\Resources\HelpInquiries\Tables\HelpInquiriesTable;
use App\Models\HelpInquiry;
use BackedEnum;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use UnitEnum;

class HelpInquiryResource extends BaseResource
{
    protected static ?string $model = HelpInquiry::class;

    protected static string|BackedEnum|null $navigationIcon = 'heroicon-o-lifebuoy';

    protected static string | UnitEnum | null $navigationGroup = 'Support';

    protected static ?string $navigationLabel = 'Help Inquiries';

    public static function canCreate(): bool
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
        return HelpInquiryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return HelpInquiriesTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => ListHelpInquiries::route('/'),
            'edit' => EditHelpInquiry::route('/{record}/edit'),
        ];
    }
}
