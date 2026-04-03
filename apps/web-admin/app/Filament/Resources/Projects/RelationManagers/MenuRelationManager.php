<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Actions\EditAction;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Resources\RelationManagers\RelationManager;

class MenuRelationManager extends RelationManager
{
    protected static string $relationship = 'menu';

    protected static ?string $recordTitleAttribute = 'name';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Menu')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Textarea::make('description')
                            ->rows(3)
                            ->columnSpanFull(),
                        TextInput::make('phone')
                            ->maxLength(50),
                        TextInput::make('email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('website_url')
                            ->url()
                            ->maxLength(255),
                        TextInput::make('layout_name')
                            ->maxLength(100),
                        TextInput::make('theme_name')
                            ->maxLength(100),
                        Toggle::make('search_enabled'),
                        Toggle::make('hours_enabled'),
                        TextInput::make('logo_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                        TextInput::make('cover_image_url')
                            ->url()
                            ->maxLength(255)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('layout_name')
                    ->label('Layout')
                    ->toggleable(),
                TextColumn::make('theme_name')
                    ->label('Theme')
                    ->toggleable(),
                IconColumn::make('search_enabled')
                    ->boolean()
                    ->label('Search'),
                IconColumn::make('hours_enabled')
                    ->boolean()
                    ->label('Hours'),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }
}
