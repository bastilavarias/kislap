<?php

namespace App\Filament\Resources\Showcases\Schemas;

use App\Models\Portfolio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ShowcaseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Showcase')
                    ->schema([
                        Select::make('portfolio_id')
                            ->label('Portfolio')
                            ->relationship('portfolio', 'name')
                            ->getOptionLabelFromRecordUsing(fn (Portfolio $record): string => $record->name)
                            ->searchable()
                            ->preload(),
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('role')
                            ->maxLength(255),
                        TextInput::make('url')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('placement_order')
                            ->numeric()
                            ->default(0),
                        Toggle::make('is_approved')
                            ->default(false),
                        Toggle::make('is_featured')
                            ->default(false),
                        Textarea::make('description')
                            ->rows(4)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }
}
